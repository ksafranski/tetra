var fs = require('fs-extra');

module.exports = function (req, res) {

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
        res.send(404, 'Resource not found');
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
    res.send(200, JSON.stringify(output));
  };

  // Create version
  var create = function () {
    // Get name
    var name = req.body.name;

    // Ensure name specified
    if (!name) {
      res.send(400, 'Bad request');
      return false;
    }

    // Check that recource DNE
    if (fs.existsSync(base + name)) {
      res.send(409, 'Resource already exists');
      return false;
    }

    // Create resource
    fs.mkdir(base + name, function (err) {
      if (err) {
        res.send(500, 'Server error');
        return false;
      }
      // Created
      res.send(201, 'Created');
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
      res.send(400, 'Bad request');
      return false;
    }

    // Check that CURRENT resource exists
    if (!fs.existsSync(base + existing)) {
      res.send(404, 'Resource not found');
      return false;
    }

    // Check that NEW recource DNE
    if (fs.existsSync(base + name)) {
      res.send(409, 'Resource already exists');
      return false;
    }

    // Update
    fs.rename(base + existing, base + name, function (err) {
      if (err) {
        res.send(500, 'Server error');
        return false;
      }
      // Mod successful
      res.send(200, 'Resource modified');
    });

  };

  // Delete version
  var del = function () {
    // Get current name
    var params = req.params[0].split('/');
    var name = params[1];

    // Ensure name specified
    if (!name) {
      res.send(400, 'Bad request');
      return false;
    }

    // Ensure exists
    if (!fs.existsSync(base + name)) {
      res.send(404, 'Resource not found');
      return false;
    }

    // Remove
    fs.remove(base + name, function (err) {
      if (err) {
        res.send(500, 'Server error');
        return false;
      }
      // Delete success
      res.send(200, 'Resource deleted');
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
    res.headers('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.send(405, 'Method not supported');
    return false;
  }

};
