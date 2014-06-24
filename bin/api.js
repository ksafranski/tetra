var config = require('./config');
var users = require('./users.js');

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

  // Determine params
  if (type === 'user') {
    // Ensure permissions to edit users
    if (req.userType !== 0) {
      res.send(403, 'Forbidden');
      return false;
    }
    // Passed auth, process...
    users(req, res);
  } else if (type === 'schema' || type === 'api') {
    // Schema or API
    handleStandardReq(type, params[1], params[2]);
  } else {
    // Not valid type
    res.send(404, 'Resource not found');
    return false;
  }

};
