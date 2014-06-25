var express = require('express');
var output = require('./output');
var processor = require('./processor');
var authentication = require('./authentication');
var config = require('./config');
var bodyParser = require('body-parser');

// Service constructor
var Service = function () {
  output('success', 'Starting service');
};

// Start the service
Service.prototype.start = function () {
  var app = express();
  // Check and load config
  if (!config.service) {
    output('error', 'Missing config file: /conf/service.json');
    return false;
  }
  // Body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  // Check authentication
  if (config.service.authentication) {
    app.use(authentication);
  }
  // Bind endpoints to api module
  app.all('/*', processor);
  // Start listener
  app.listen(config.service.port);
  output('success', 'Service running over ' + config.service.port);
};

// Export
module.exports = Service;
