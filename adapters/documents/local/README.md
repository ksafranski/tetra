# Local Adapter

This adapter is used to connect to a local, file-based data store using 
[NeDB](https://github.com/louischatriot/nedb) and requires no additional 
dependencies.

## Configuration

In `/conf/service.json` set the following for `documents`:

```javascript
  "adapter": "local",
  "path": "documents/"
```