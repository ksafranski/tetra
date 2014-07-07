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
var connectDomain = require('connect-domain');

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
  if (fs.existsSync(certPath + 'ssl.key') && fs.existsSync(certPath + 'ssl.crt')) {
    var opts = {
      key: fs.readFileSync(certPath + 'ssl.key'),
      cert: fs.readFileSync(certPath + 'ssl.crt')
    };
    // Check PEM
    if (fs.existsSync(certPath + 'ssl.pem')) {
      opts.ca = fs.readFileSync(certPath + 'ssl.crt');
    }
    // Use SSL
    sslApp = https.createServer(opts, app);
  }
  // Error exception handler
  var errorHandler = function (err, req, res) {
    res.send(500, 'Internal error');
    console.log(err);
  };
  // Check and load config
  if (!config.service) {
    output('error', 'Missing config file: /conf/service.json');
    return false;
  }
  // CORS
  var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', config.service.cors);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Intercept OPTIONS method
    if ('OPTIONS' === req.method) {
      res.send(200);
    } else {
      next();
    }
  };
  app.use(allowCrossDomain);
  app.use(connectDomain());
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
  // Bind endpoints to api module
  app.all('/*', processor).use(errorHandler);
  // Start listener
  if (sslApp) {
    sslApp.listen(config.service.port);
  } else {
    app.listen(config.service.port);
  }
  output('success', 'Service running over ' + config.service.port);
};

// Export
module.exports = Service;
