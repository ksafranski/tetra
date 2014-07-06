var spawn = require('child_process').spawn;
var output = require('./../libs/output');
var readline = require('readline');
var proc = spawn('node', [ 'index.js' ], {
  cwd: __dirname + '/../'
});

readline.createInterface({
  input: proc.stdout,
  terminal: false
}).on('line', function (line) {
  console.log(line);
});

proc.on('close', function (code) {
  output('success', 'Service stopped');
});

setTimeout(function () {
  proc.kill();
}, 3000);