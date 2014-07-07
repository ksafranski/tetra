var spawn = require('child_process').spawn;
var output = require('./../libs/output');
var readline = require('readline');
var async = require('async');
var client = require('./client');

// Test groups
var groups = [
  'authentication',
  'users',
  'versions',
  'schemas',
  'documents'
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

var endTests = function () {
  proc.kill();
};

// Process has fully started
proc.on('message', function () {

  // Build tests
  var tests = [];
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
    // Start timer
    var start = new Date().getTime();
    // Pass to client
    client.test(test, function (res) {
      var status = 'success';
      // Check returned code
      console.log(test.specs.resultCode, res.statusCode);
      if (test.specs.resultCode !== res.statusCode) {
        output('error', test.name + ' returned ' + res.statusCode + ', expected: ' + test.specs.resultCode);
        if (res.body) {
          output('error', 'BODY: ' + res.body);
        }
        status = 'error';
      }
      // Check data
      if (test.result) {
        if (test.specs.result !== res.body) {
          output('error', test.name + ' result did not match');
          output('error', 'BODY: ' + res.body);
          status = 'error';
        }
      }

      if (status !== 'error') {
        // Passed!
        var end = new Date().getTime();
        var time = end - start;
        output('success', test.name + ' passed tests (' + time + 'ms)');
      }

      // Output data
      if (res.body) {
        output(status, 'RESPONSE DATA:');
        output(status, '-------------------------------');
        var out;
        try {
          out = JSON.parse(res.body);
        } catch (e) {
          out = res.body;
        }
        console.log(JSON.stringify(out, null, 4));
        output(status, '-------------------------------');
      }

      if (status === 'error') {
        callback(true);
      } else {
        callback();
      }

    });
  }, function (err) {
    if (err) {
      output('error', 'TESTS FAILED');
    }
    endTests();
  });
});
