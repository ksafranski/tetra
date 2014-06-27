var express = require('express');
var output = require('./output');
var processor = require('./processor');
var authentication = require('./authentication');
var config = require('./config');
var bodyParser = require('body-parser');
var connectDomain = require('connect-domain');

// Service constructor
var Service = function () {
  output('success', 'Starting service');
};

// Start the service
Service.prototype.start = function () {
  var app = express();
  var errorHandler = function (err, req, res) {
    res.send(500, 'Internal error');
    console.log(err);
  };
  // Check and load config
  if (!config.service) {
    output('error', 'Missing config file: /conf/service.json');
    return false;
  }
  app.use(connectDomain());
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
  app.all('/*', processor).use(errorHandler);
  // Start listener
  app.listen(config.service.port);
  output('success', 'Service running over ' + config.service.port);
};

// Export
module.exports = Service;
