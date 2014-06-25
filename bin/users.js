var passwordHash = require('password-hash');
var fs = require('fs');

module.exports = function (req) {

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
    self.respond(500);
    return false;
  } else {
    // Convert to object
    users = JSON.parse(users);
  }

  // Save data back to users file
  var saveData = function (code) {
    // Write to file
    fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf8', function (err) {
      if (err) {
        self.respond(500);
        return false;
      }
      // Send proper response (201 or 200)
      self.respond(code);
    });
  };

  // Read single user or list
  var read = function () {
    var params = req.params[0];
    var username = params.split('/').pop();

    // Check type
    if (username) {
      // Single entity request
      if (users.hasOwnProperty(username)) {
        self.respond(200, users[username]);
      } else {
        self.respond(404);
      }
    } else {
      // Full request
      self.respond(200, users);
    }

  };

  // Create user
  var create = function () {

    // Ensure mandatory data
    if (!req.body.username || !req.body.password) {
      // Malformed
      self.respond(400);
      return false;
    }

    // Ensure account doesn't already exist
    if (users.hasOwnProperty(req.body.username)) {
      // Already exists
      self.respond(409);
      return false;
    }

    // Set insert object
    var input = {};
    // Encrypt password
    input.password = passwordHash.generate(req.body.password);
    input.data = req.body.data || {};
    input.type = req.body.type || 1;

    // Add to users
    users[req.body.username] = input;

    // Save
    saveData(201);
  };

  // Update user
  var update = function () {

  };

  // Delete user
  var del = function () {

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
