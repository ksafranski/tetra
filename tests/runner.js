var spawn = require('child_process').spawn;
var output = require('./../libs/output');
var readline = require('readline');

// Test groups
var tests = {};
var groups = [
  'authentication'
];

// Start server
var proc = spawn('node', [ 'index.js' ], {
  cwd: __dirname + '/../',
  stdio: ['ipc']
});

// Read output
readline.createInterface({
  input: proc.stdout,
  terminal: false
}).on('line', function (line) {
  console.log(line);
});

// Handle process exit
proc.on('close', function (code) {
  output('success', 'Service stopped');
});

// Process has fully started
proc.on('message', function() {
  
});


setTimeout(function () {
  proc.kill();
}, 3000);