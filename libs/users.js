var passwordHash = require('password-hash');
var Datastore = require('nedb');

module.exports = function (req, res) {

  var db = new Datastore({
    filename: 'conf/users.db',
    autoload: true
  });

  // Ensure index
  db.ensureIndex({
    fieldName: 'username',
    unique: true
  }, function (err) {
    if (err) {
      console.log(err);
    }
  });

  var self = this;

  // Params
  var params = req.params[0];
  var username = params.split('/').pop();
  var query = {};

  // Setup query
  if (username !== 'user') {
    query = {
      username: username
    };
  } else if (req.query.search) {
    try {
      query = JSON.parse(req.query.search);
    } catch (e) {
      self.respond(400, 'Invalid query');
      return false;
    }
    var operators = ['$ne', '$lt', '$lte', '$gt', '$gte'];
    // Verify comparison operators
    for (var q in query) {
      if (typeof query[q] === 'object') {
        if (operators.indexOf(Object.keys(query[q])[0]) === -1) {
          self.respond(400, 'Invalid query operator');
          return false;
        }
      }
    }
  } else {
    query = {};
  }

  // Read single user or list
  var read = function () {

    // Run query
    db.find(query, function (err, data) {
      if (err) {
        self.respond(500, err);
        return false;
      }

      // No data
      if (!data.length) {
        self.respond(404);
        return false;
      }

      // Don't return passwords
      for (var i = 0, z = data.length; i < z; i++) {
        delete data[i].password;
      }

      // Single item
      if (username !== 'user') {
        data = data[0];
      }

      // Success
      self.respond(200, data);

    });

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
      input.type = (req.body.type === 0) ? 0 : 1;

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
    // Ensure query
    if (typeof query !== 'object' || !Object.keys(query).length) {
      self.respond(400, 'Invalid query');
      return false;
    }
    // Ensure user exists
    db.find(query, function (err, data) {
      if (err) {
        self.respond(500, err);
        return false;
      }

      // User already exists
      if (!data.length) {
        self.respond(404);
        return false;
      }

      var options = {};
      if (data.length > 1) {
        options.multi = true;
      }

      // Encrypt password
      for (var field in req.body) {
        if (field === 'password') {
          req.body.password = passwordHash.generate(req.body.password);
        }
      }

      // Update
      db.update(query, {
        $set: req.body
      }, options, function (err) {

        if (err) {
          self.respond(500, err);
          return false;
        }

        // Success
        self.respond(204);

      });

    });
  };

  // Delete user
  var del = function () {
    // Ensure query
    if (typeof query !== 'object' || !Object.keys(query).length) {
      self.respond(400, 'Invalid query');
      return false;
    }
    // Run query
    db.remove(query, {
      multi: true
    }, function (err) {
      if (err) {
        self.respond(500, err);
        return false;
      }
      // Success
      self.respond(204);
    });
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
