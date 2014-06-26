var users = require('./users');
var versions = require('./versions');
var schemas = require('./schemas');
var api = require('./api');

module.exports = function (req, res) {

  var self = this;

  // Global response handler
  this.respond = function (code, data) {
    // Error codes
    var codes = {
      '200': 'Success',
      '201': 'Resource created',
      '400': 'Bad request',
      '403': 'Forbidden',
      '404': 'Resource not found',
      '405': 'Method not supported',
      '409': 'Resource conflict',
      '500': 'Internal error'
    };

    // Set allow-methods header on 405
    if (code === 405) {
      res.headers('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    }

    // Send response
    if (data) {
      // Success responses, include data
      res.send(code, data);
    } else {
      // Failure responses, include error message
      res.send(code, codes[code]);
    }

  };

  // Check for userType (authentication)
  if (!req.hasOwnProperty('userType')) {
    // DNE, set to 0 (full access, no auth)
    req.userType = 0;
  }

  // Split params
  var params = req.params[0].split('/');

  // Get type
  var type = params[0];

  // Checks auth permissions, then runs function (or returns false)
  var checkPerms = function (cb) {
    if (req.userType !== 0) {
      self.respond(403);
      return false;
    }
    // Fire callback
    cb();
  };

  // Determine params
  switch (type) {
  case 'user':
    checkPerms(function () {
      users.call(self, req);
    });
    break;
  case 'version':
    checkPerms(function () {
      versions.call(self, req);
    });
    break;
  case 'schema':
    checkPerms(function () {
      schemas.call(self, req);
    });
    break;
  case 'api':
    api.call(self, req);
    break;
  default:
    // Not valid type
    self.respond(404);
    return false;
  }

};