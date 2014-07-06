var spawn = require('child_process').spawn;
var output = require('./../libs/output');
var readline = require('readline');
var async = require('async');

// Test groups
var tests = [];
var groups = [
  'authentication'
];

// Start server
var proc = spawn('node', ['index.js'], {
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
proc.on('close', function () {
  output('success', 'Service stopped');
});

// Process has fully started
proc.on('message', function () {
  // Build tests
  output('success', 'Building tests');
  for (var i = 0, z = groups.length; i < z; i++) {
    var group = require('./groups/' + groups[i]);
    for (var test in group) {
      tests.push({
        name: groups[i].toUpperCase() + ' >> ' + test,
        specs: group[test]
      });
    }
  }
  // Run tests
  async.eachSeries(tests, function (test, callback) {
    output('success', 'Running: ' + test.name);
    callback();
  }, function (err) {
    if (err) {
      output('error', 'TEST FAILED');
    }
    proc.kill();
  });
});
