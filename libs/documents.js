var fs = require('fs');

module.exports = function (req) {

  var self = this;

  var base = __dirname + '/../conf/';

  // Get params
  var params = req.params[0].split('/');
  var version = params[1];
  var endpoint = params[2];
  var query = {};
  
  // Split QS
  if (endpoint.indexOf('?') !== -1) {
    // query = {};
    var qsparams = endpoint.split('?');
    endpoint = qsparams[0];
    var sections = qsparams[1].split('&');
    for (var i=0, z=sections.length; i<z; i++) {
        var pair = sections[i].split('=');
        query[pair[0]] = pair[1];
    }
  } else {
    // By ID
    query = { id: query };
  }

  var schema;

  // Ensure version exists
  if (!fs.existsSync(base + version)) {
    self.respond(404, 'Version does not exist');
    return false;
  }

  // Ensure schema exists, load into memory
  if (!fs.existsSync(base + version + '/' + endpoint + '.json')) {
    self.respond(404, 'Schema does not exist');
    return false;
  } else {
    try {
      // Load into object
      schema = JSON.parse(fs.readFileSync(base + version + '/' + endpoint + '.json', 'utf8'));
    } catch (e) {
      // No dice
      self.respond(500, 'Error loading schema');
      return false;
    }
  }
  
  // Build query
  var buildQuery = function() {
    
  };

  // Get single or multiple documents
  var read = function () {
    if (!query) {
      // Get all
    } else {
      // Build query
    }
  };

  // Create a document
  var create = function () {

  };

  // Update a document
  var update = function () {

  };

  // Delete a document
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
