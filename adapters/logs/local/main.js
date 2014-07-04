module.exports = function (req, res, next) {

  var send;
  var end;

  // Save the log
  var save = function (log) {
    console.log(log);
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
      respKb: Math.round(len * 10) / 10
    };
    if (req.headers) { // Headers?
      obj.headers = req.headers;
    }
    if (req.body) { // Body?
      obj.body = req.body;
    }
    if (req.query) { // Query?
      obj.qs = req.query;
    }
    if (req.params) { // Params?
      obj.params = req.params;
    }
    if (req.files) { // Files?
      obj.files = Object.keys(req.files);
    }

    save(obj);

  };

  return next();
};
