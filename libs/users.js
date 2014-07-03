var passwordHash = require('password-hash');
var _ = require('underscore');
var fs = require('fs');
var Datastore = require('nedb');
var db = new Datastore({
  filename: './../conf/users',
  autoload: true
});

module.exports = function (req, res) {

  var self = this;

  // Users record file
  var usersFile = __dirname + '/../conf/users.json';

  // Get data
  var users = fs.readFileSync(usersFile, 'utf8', function (err, data) {
    if (err) {
      return false;
    }
    // Ensure proper data
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return data;
  });

  if (!users) {
    // User FAIL
    self.respond(500, 'Missing user data');
    return false;
  } else {
    // Convert to object
    users = JSON.parse(users);
  }

  // Save data back to users file
  var saveData = function (code) {
    var name = Object.keys(users)[0];
    // Write to file
    fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf8', function (err) {
      if (err) {
        self.respond(500);
        return false;
      }
      // Send proper response (201 or 200)
      if (code === 201) {
        res.header('Location', self.uri + name);
      }
      self.respond(code);
    });
  };

  // Read single user or list
  var read = function () {
    var params = req.params[0];
    var username = params.split('/').pop();

    // Strip passwords
    for (var u in users) {
      delete users[u].password;
    }

    // Check type
    if (username) {
      // Single entity request
      if (users.hasOwnProperty(username)) {
        self.respond(200, users[username]);
      } else {
        self.respond(404, 'User does not exist');
      }
    } else {
      // Full request
      self.respond(200, users);
    }

  };

  // Create user
  var create = function () {

    // Ensure mandatory data
    if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('password')) {
      // Malformed
      self.respond(400, 'Not a valid request body');
      return false;
    }

    // Ensure new user
    db.find({
      username: req.body.username
    }, function (err, data) {
      if (err) {
        self.respond(500, err);
        return false;
      }

      // User already exists
      if (data.length) {
        self.respond(409, 'User already exists');
        return false;
      }

      // Set insert object
      var input = {};
      input.username = req.body.username;
      // Encrypt password
      input.password = passwordHash.generate(req.body.password);
      input.data = req.body.data || {};
      input.type = req.body.type || 1;

      // Add to users
      db.insert(input, function (err, data) {
        if (err) {
          self.respond(500, err);
          return false;
        }
        // Success
        res.header('Location', self.uri + data._id);
        self.respond(201, data);
      });

    });
  };

  // Update user
  var update = function () {

    // Get param
    var params = req.params[0];
    var username = params.split('/').pop();

    // Ensure user exists
    if (!users.hasOwnProperty(username)) {
      self.respond(404, 'User does not exist');
      return false;
    }

    // Encrypt password (if applicable)
    if (req.body.hasOwnProperty('password')) {
      req.body.password = passwordHash.generate(req.body.password);
    }

    // Update
    _.extend(users[username], req.body);

    // Save
    saveData(200);

  };

  // Delete user
  var del = function () {
    // Get param
    var params = req.params[0];
    var username = params.split('/').pop();

    // Ensure user exists
    if (!users.hasOwnProperty(username)) {
      self.respond(404, 'User does not exist');
      return false;
    }

    // Remove
    delete users[username];

    // Save
    saveData(204);
  };

  // Check method
  switch (req.method) {
  case 'GET':
    read();
    break;
  case 'POST':
    create();
    break;
  case 'PUT':
    update();
    break;
  case 'DELETE':
    del();
    break;
  default:
    // Unsupported method
    self.respond(405);
    return false;
  }

};
