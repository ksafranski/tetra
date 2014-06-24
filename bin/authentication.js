var config = require('./config');
var output = require('./output');
var passwordHash = require('password-hash');

module.exports = function (req, res, next) {
  var auth;

  var fail = function () {
    // Send an Basic Auth request (HTTP Code: 401 Unauthorized)
    res.statusCode = 401;
    // Send header
    res.setHeader('WWW-Authenticate', 'Basic realm="' + config.service.name + '"');
    // End with unauthorized
    res.end('Unauthorized');
  };

  // Get users function
  var getUsers = function () {
    try {
      return require('./../conf/users.json');
    } catch (err) {
      return false;
    }
  };

  // Get users
  var users = getUsers();

  // Ensure users exists
  if (!users) {
    output('error', 'No users file or valid user accounts for authentication');
    fail();
    return false;
  }

  // Check authorization header
  if (req.headers.authorization) {
    // * Cut the starting "Basic " from the header
    // * Decode the base64 encoded username:password
    // * Split the string at the colon
    auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
  }

  // Check for username
  if (!auth || !users.hasOwnProperty(auth[0])) {
    // Auth missing or username not found
    fail();
  } else if (!passwordHash.verify(auth[1], users[auth[0]].password)) {
    // Incorrect password
    fail();
  } else {
    // Set user type in request object
    req.userType = users[auth[0]].type;
    next();
  }
};
