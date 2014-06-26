var fs = require('fs');

module.exports = function (req) {

  var self = this;
  var base = __dirname + '/../conf/schemas/';

  // Get params
  var params = req.params[0].split('/');
  var version = params[1];
  var schema = params[2];

  // Ensure version
  if (!fs.existsSync(base + version)) {
    console.log('here?');
    self.respond(404);
    return false;
  }

  var schemaExists = function () {
    if (!fs.exists(base + version + '/' + schema + '.json')) {
      // Nope
      return false;
    }
    // YAY!
    return true;
  };

  // Get schema or schema list
  var read = function () {
    if (schema) {
      // Return specific schema
      if (schemaExists(schema)) {
        fs.readFile(base + version + '/' + schema + '.json', 'utf8', function (err, data) {
          if (err) {
            self.respond(500);
            return false;
          }
          // Success
          self.respond(200, data);
        });
      } else {
        self.respond(404);
        return false;
      }
    } else {
      // Output object
      var output = {};
      // Return all schemas
      var schemas = fs.readdirSync(base + version);
      // Loop through schemas
      for (var x = 0, y = schemas.length; x < y; x++) {
        // Only JSON files
        if (schemas[x].split('.').pop() === 'json') {
          // JSON good => add to object
          output[schemas[x].slice(0, -5)] = JSON.parse(fs.readFileSync(base + version + '/' + schemas[x], 'utf8'));
        }
      }
      self.respond(200, output);
    }
  };

  // Create a new schema
  var create = function () {

  };

  // Update an existing schema
  var update = function () {

  };

  // Delete an existing schema
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
