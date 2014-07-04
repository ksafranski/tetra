var output = require('./output');
var config = {

  // Build configuration object
  load: function () {
    var self = this;
    // Get service configuration
    self.service = self.getConfig('service');
  },

  // Get specific config
  getConfig: function (file) {
    try {
      return require('./../conf/' + file + '.json');
    } catch (err) {
      output('error', 'Could not load config: ' + file);
      return false;
    }
  }

};

// Load config
config.load();

// Return config object
module.exports = config;
