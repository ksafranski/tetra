var output = require('./output');
var fs = require('fs');

var config = {

  // Build configuration object
  load: function () {
    var self = this;
    // Get service configuration
    self.service = self.getConfig('service');
    // Load schemas by version
    if (self.service.hasOwnProperty('versions')) {
      // Set versions property
      self.versions = {};
      // Loop in 
      for (var i = 0, z = self.service.versions.length; i < z; i++) {
        var name = self.service.versions[i];
        var path = __dirname + '/../conf/schemas/' + name;
        // Ensure directory
        if (!fs.existsSync(path)) {
          output('error', 'Missing version directory for ' + name);
          return false;
        }
        // Set version node array
        self.versions[name] = [];
        // Loop in files (schemas) for version
        var schemas = fs.readdirSync(path);
        for (var x = 0, y = schemas.length; x < y; x++) {
          if (schemas[x].split('.').pop() === 'json') {
            // Push filename (sans extension)
            self.versions[name].push(schemas[x].replace('.json', ''));
          }
        }
      }
    }
    // Return object
    return this;
  },

  // Get specific config
  getConfig: function (file) {
    try {
      return require('./../conf/' + file + '.json');
    } catch (err) {
      return false;
    }
  }

};

// Load config
config.load();

// Return config object
module.exports = config;
