var config = require('./../../../libs/config');
var winston = require('winston');
var path = require('path');
var transports = [];
var fs = require('fs');
var logPath = __dirname + '/../../../' + config.service.logs.path;
// Ensure log directory exists
if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

// Create file transport
transports.push(new winston.transports.DailyRotateFile({
  name: 'file',
  datePattern: '.yyyy-MM-ddTHH',
  filename: path.join(logPath, 'http.log')
}));

// Create new logger
var logger = new winston.Logger({
  transports: transports
});

module.exports = function (req, res, next) {

  var send;
  var end;

  // Save the log
  var save = function (log) {
    logger.info(log);
  };

  // Set start time
  if (!req._startTime) {
    req._startTime = new Date();
  }

  // Process request send
  send = res.send;
  res.send = function (_status, _body) {
    res.send = send;
    if (_body) {
      return res.send(_status, _body);
    } else {
      return res.send(_status);
    }
  };

  // Process request end
  end = res.end;
  res.end = function (c, e) {
    var ip, len, obj;
    res.end = end;
    res.end(c, e);
    if (req.ip) {
      ip = req.ip;
    } else if (req.socket && req.socket.socket) {
      ip = req.socket.socket.remoteAddress;
    }
    len = parseInt(res.getHeader('Content-Length') || '0', 10) / 1024;
    // Create obj
    obj = {
      at: req._startTime,
      duration: (new Date()) - req._startTime,
      status: res.statusCode,
      ip: ip,
      path: req.path || req.originalUrl || req.url,
      method: req.method,
      respKb: Math.round(len * 10) / 10,
      headers: (req.headers) ? req.headers : null,
      body: (req.body) ? req.body : {},
      qs: (req.query) ? req.query : {},
      params: (req.params) ? req.params : {}
    };

    // Save to log
    save(obj);
  };

  return next();
};
