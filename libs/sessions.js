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

  // Get/Check session data
  var read = function () {
    // Ensure session
    if (!req.session || !req.session.hasOwnProperty('user')) {
      self.respond(401);
      return false;
    }
    // Success
    self.respond(200, req.session.user);
  };

  // Authenticate, create new session
  var create = function () {
    // Check body
    if (!req.body.username || !req.body.password) {
      self.respond(400);
      return false;
    }

    // Authenticate
    db.find({
      username: req.body.username
    }, function (err, data) {
      if (err) {
        // DB error
        res.send(500);
        return false;
      }

      // Username
      if (!data.length) {
        res.send(401, 'Invalid username');
        return false;
      }

      // Password
      if (!passwordHash.verify(req.body.password, data[0].password)) {
        res.send(401, 'Invalid password');
        return false;
      }

      // Success
      delete data[0].password;
      req.session.user = data[0];
      res.send(201);
    });
  };

  // Delete current session
  var del = function () {
    // Ensure session
    if (!req.session.user) {
      self.respond(401);
      return false;
    }

    // Delete
    delete req.session.user;
    self.respond(204);
  };

  switch (req.method) {
  case 'GET':
    read();
    break;
  case 'POST':
    create();
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
