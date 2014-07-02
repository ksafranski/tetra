# Mongo Adapter

This adapter is used to connect to a Mongo database and process transactions 
performed on the system.

## Configuration

In `/conf/service.json` set the following for `documents`:

```javascript
  "adapter": "mongo",
  "host": "http://localhost",
  "user": "mongouser",
  "pass": "mongopass",
  "db": "test"
```