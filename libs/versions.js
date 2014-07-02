var fs = require('fs-extra');

module.exports = function (req, res) {

  var self = this;

  var base = __dirname + '/../conf/schemas/';

  // Read single version or list
  var read = function () {
    var params = req.params[0].split('/');
    var schemas;
    var output = {};
    var i, z, x, y;

    // Check request type (single or all)
    if (params[1]) {
      // Single version request
      if (fs.existsSync(base + params[1])) {
        output[params[1]] = [];
        schemas = fs.readdirSync(base + params[1]);
        for (x = 0, y = schemas.length; x < y; x++) {
          // Only JSON files
          if (schemas[x].split('.').pop() === 'json') {
            // JSON good => push into array
            output[params[1]].push(schemas[x].slice(0, -5));
          }
        }
      } else {
        self.respond(404);
        return false;
      }
    } else {
      // Get all versions and schemas
      var versions = fs.readdirSync(base);
      // Loop through and build array of versions
      for (i = 0, z = versions.length; i < z; i++) {
        if (!fs.statSync(base + versions[i]).isFile()) {
          // Set schemas array for specific version
          schemas = fs.readdirSync(base + versions[i]);
          // Loop in schemas
          output[versions[i]] = [];
          for (x = 0, y = schemas.length; x < y; x++) {
            // Only JSON files
            if (schemas[x].split('.').pop() === 'json') {
              // JSON good => push into array
              output[versions[i]].push(schemas[x].slice(0, -5));
            }
          }
        }
      }
    }
    // No failures, send output
    self.respond(200, JSON.stringify(output));
  };

  // Create version
  var create = function () {
    // Get name
    var name = req.body.name;

    // Ensure name specified
    if (!name) {
      self.respond(400, 'No name specified');
      return false;
    }

    // Check that recource DNE
    if (fs.existsSync(base + name)) {
      self.respond(409, 'Version already exists');
      return false;
    }

    // Create resource
    fs.mkdir(base + name, function (err) {
      if (err) {
        self.respond(500);
        return false;
      }
      // Created
      res.header('Location', self.uri + name);
      self.respond(201);
    });
  };

  // Update version
  var update = function () {
    // Get current name
    var params = req.params[0].split('/');
    var existing = params[1];
    // Get new name
    var name = req.body.name;

    // Ensure name specified
    if (!name || !existing) {
      self.respond(400, 'No name specified');
      return false;
    }

    // Check that CURRENT resource exists
    if (!fs.existsSync(base + existing)) {
      self.respond(404, 'Version does not exist');
      return false;
    }

    // Check that NEW recource DNE
    if (fs.existsSync(base + name)) {
      self.respond(409, 'Version already exists');
      return false;
    }

    // Update
    fs.rename(base + existing, base + name, function (err) {
      if (err) {
        self.respond(500);
        return false;
      }
      // Mod successful
      self.respond(200);
    });

  };

  // Delete version
  var del = function () {
    // Get current name
    var params = req.params[0].split('/');
    var name = params[1];

    // Ensure name specified
    if (!name) {
      self.respond(400, 'No name specified');
      return false;
    }

    // Ensure exists
    if (!fs.existsSync(base + name)) {
      self.respond(404, 'Version does not exist');
      return false;
    }

    // Remove
    fs.remove(base + name, function (err) {
      if (err) {
        self.respond(500);
        return false;
      }
      // Delete success
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
