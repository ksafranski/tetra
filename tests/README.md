# System Tests

The test runner contains a number of test conditions run to ensure that the 
service is properly handling requests. Tests can be run via the following command:

```
npm run tests
```

The tests will only modify the SSL condition of the service, disabling SSL only 
while the test service is running.

All other settings, such as adapters, will remain intact allowing the tests to 
check conditions based on individual builds or configurations.