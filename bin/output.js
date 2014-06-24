var clc = require('cli-color');

// Creates colored, typed console outputs
module.exports = function (type, message) {
  if (type === 'success') {
    console.log(clc.greenBright.bold('#> ') + message);
  } else {
    console.log(clc.redBright.bold('#> ') + message);
  }
};
