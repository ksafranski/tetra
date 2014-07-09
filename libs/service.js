var express = require('express');
var fs = require('fs');
var https = require('https');
var output = require('./output');
var processor = require('./processor');
var authentication = require('./authentication');
var config = require('./config');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var errorHandler = require('./errors');

// SSL App
var sslApp = false;

// Cert path
var certPath = __dirname + '/../conf/certs/';

// Service constructor
var Service = function () {
  output('success', 'Starting service');
};

// Start the service
Service.prototype.start = function () {
  var app = express();
  // SSL (Check and run)
  if (!process.env.TESTS) {
    if (fs.existsSync(certPath + 'ssl.key') && fs.existsSync(certPath + 'ssl.crt')) {
      var opts = {
        key: fs.readFileSync(certPath + 'ssl.key'),
        cert: fs.readFileSync(certPath + 'ssl.crt')
      };
      // Check PEM
      if (fs.existsSync(certPath + 'ssl.pem')) {
        opts.ca = fs.readFileSync(certPath + 'ssl.pem');
      }
      // Use SSL
      sslApp = https.createServer(opts, app);
    }
  }
  // Check and load config
  if (!config.service) {
    output('error', 'Missing config file: /conf/service.json');
    return false;
  }
  // CORS
  var allowCrossDomain = function (req, res, next) {
    var allowedHeaders = 'access-control-allow-origin, accept, authorization, content-type';
    res.header('Access-Control-Allow-Origin', config.service.cors);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', allowedHeaders);
    // Intercept OPTIONS method
    if ('OPTIONS' === req.method) {
      res.send(200);
    } else {
      next();
    }
  };
  app.use(allowCrossDomain);
  // Sessions
  app.use(cookieParser());
  app.use(expressSession({
    resave: true,
    saveUninitialized: true,
    secret: config.service.secret
  }));
  // Body parser
  app.use(bodyParser.json());
  // Check authentication
  if (config.service.authentication) {
    app.use(authentication);
  }
  // Logging
  if (config.service.logs) {
    var logger = require('./../adapters/logs/' + config.service.logs.adapter + '/main.js');
    app.use(logger);
  }
  // General error catch
  app.use(errorHandler);
  // Bind endpoints to api module
  app.all('/*', processor);
  // Start listener
  if (sslApp) {
    sslApp.listen(config.service.port);
  } else {
    app.listen(config.service.port);
  }
  output('success', 'Service running over ' + config.service.port);
  // Used for sending signal to tests when service started
  if (process.hasOwnProperty('send')) {
    process.send({
      running: true
    });
  }
};

// Export
module.exports = Service;
