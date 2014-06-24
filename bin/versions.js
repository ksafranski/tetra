var fs = require('fs-extra');

module.exports = function (req, res) {

  // Read single version or list
  var read = function () {
    var base = __dirname + '/../conf/schemas/';
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

  };

  // Update version
  var update = function () {

  };

  // Delete version
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
    res.headers('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.send(405, 'Method not supported');
    return false;
  }

};
