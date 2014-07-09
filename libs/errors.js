module.exports = function (err, req, res, next) {
  if (err) {
    if (err.toString().indexOf('Unexpected token') !== -1) {
      // The crap bodyParser doesn't seem to catch...
      res.send(400, {
        response: 'Invalid format of request body'
      });
      return false;
    } else {
      // General f-up's
      res.send(500, {
        response: 'Error processing request'
      });
      return false;
    }
  }
  next();
};
