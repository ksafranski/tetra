var users = require('./users');
var versions = require('./versions');
var schemas = require('./schemas');
var documents = require('./documents');
var blobs = require('./blobs');

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

    // Set headers
    res.header('Content-Type', 'application/json');
    res.header('X-Powered-By', 'Gremlins on Unicycles');

    // Set allow-methods header on 405
    if (code === 405) {
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    }

    // Send response
    if (data) {
      // If data property
      res.send(code, data);
    } else {
      // No data property
      res.send(code, {
        response: codes[code]
      });
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
      users.call(self, req, res);
    });
    break;
  case 'version':
    checkPerms(function () {
      versions.call(self, req, res);
    });
    break;
  case 'schema':
    checkPerms(function () {
      schemas.call(self, req, res);
    });
    break;
  case 'document':
    documents.call(self, req);
    break;
  case 'blob':
    blobs.call(self, req, res);
    break;
  default:
    // Not valid type
    self.respond(404);
    return false;
  }

};
