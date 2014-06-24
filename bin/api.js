var config = require('./config');
var users = require('./users');
var versions = require('./versions');

// Method handlers
var methods = {};
methods.GET = require('./methods/get');
methods.POST = require('./methods/post');
methods.PUT = require('./methods/put');
methods.DELETE = require('./methods/delete');

module.exports = function (req, res) {

  // Check for userType (authentication)
  if (!req.hasOwnProperty('userType')) {
    // DNE, set to 0 (full access, no auth)
    req.userType = 0;
  }

  // Split params
  var params = req.params[0].split('/');

  // Get type
  var type = params[0];

  // Handles "standard" schema or api requests
  var handleStandardReq = function (type, version, schema) {
    var schemas;

    // Ensure :version exists, set schemas
    if (config.versions.hasOwnProperty(version)) {
      schemas = config.versions[version];
    } else {
      res.send(404, 'Resource not found');
      return false;
    }

    // Check permissions on schema edit
    if (type === 'schema' && req.userType !== 0) {
      // Not valid to access/modify schemas
      res.send(403, 'Forbidden');
      return false;
    }

    // Ensure :schema exists
    if (schemas.indexOf(schema) === -1) {
      res.send(404, 'Resource not found');
      return false;
    }

    // Process
    if (methods.hasOwnProperty(req.method)) {
      // Method exists, process
      methods[req.method](type, req, res);
    } else {
      // Unsupported method
      res.headers('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
      res.send(405, 'Method not supported');
      return false;
    }
  };

  // Checks auth permissions, then runs function (or returns false)
  var checkPerms = function (cb) {
    if (req.userType !== 0) {
      res.send(403, 'Forbidden');
      return false;
    }
    // Fire callback
    cb();
  };

  // Determine params
  switch (type) {
  case 'user':
    checkPerms(function () {
      users(req, res);
    });
    break;
  case 'version':
    checkPerms(function () {
      versions(req, res);
    });
    break;
  case 'schema':
    checkPerms(function () {
      handleStandardReq(type, params[1], params[2]);
    });
    break;
  case 'api':
    handleStandardReq(type, params[1], params[2]);
    break;
  default:
    // Not valid type
    res.send(404, 'Resource not found');
    return false;
  }

};
