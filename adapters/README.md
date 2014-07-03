# Adapters

Adapters allows the service to connect to document and blob data storage services 
such as database instances or storage containers.

Each adapter (whether document or blob) should have its own parent directory inside 
of the appropriate adapters sub-directory. The primary file should be named `main.js` 
so the service can locate it. Any additional resources, modules, libraries, etc. can 
be added as needed.

Each adapter has 4 primary methods of a constructor function with which the 
service will interact and utilize to process requests and responses.

---

## Documents

Any configuration variables required can be accessed by including the config module
via:

```javascript
var config = require('./../../../libs/config');
```

The contstructor function should be written as follows and passes no arguments:

```javascript
var Conn = function () {
  // Any initialization code required...
}
```

The `find` method should be written as follows:

```javascript
Conn.prototype.find = function (coll, cursor, query, orderby, cb) {
  // coll => Collection name / table
  // cursor => Object: { page: N, limit: N }
  // query => Query object (JSON) passed through the API request
  // orderby => Orderby object (JSON) passed through API request
  // cb => Callback which accepts (err, data) as arguments:
  //         err: { code: 404, message: 'Not found' } -or- false,
  //         data: Return data object, no envelope
};
```

The `insert` method should be written as follows:

```javascript
Conn.prototype.insert = function (coll, data, cb) {
  // coll => Collection name / table
  // data => Valid JSON object
  // cb => Callback which accepts (err, data) as arguments:
  //         err: { code: 404, message: 'Not found' } -or- false,
  //         data: Return data object, no envelope
};
```

The `update` method should be written as follows:

```javascript
Conn.prototype.update = function (coll, query, data, cb) {
  // coll => Collection name / table
  // query => Query object (JSON) passed through the API request
  // data => Valid JSON object
  // cb => Callback which accepts (err, data) as arguments:
  //         err: { code: 404, message: 'Not found' } -or- false,
  //         data: Return data object, no envelope
};
```

The `remove` method should be written as follows:

```javascript
Conn.prototype.remove = function (coll, query, cb) {
  // coll => Collection name / table
  // query => Query object (JSON) passed through the API request
  // cb => Callback which accepts (err, data) as arguments:
  //         err: { code: 404, message: 'Not found' } -or- false,
  //         data: Return data object, no envelope
};
```

---

## Blobs

Any configuration variables required can be accessed by including the config module
via:

```javascript
var config = require('./../../../libs/config');
```

The contstructor function should be written as follows and passes no arguments:

```javascript
var Conn = function () {
  // Any initialization code required...
}
```

The `find` method should be written as follows:

```javascript
Conn.prototype.find = function (blob, cb) {
  // blob => name/path of blob
  // cb => Callback which accepts (err, data) as arguments:
  //         err: { code: 404, message: 'Not found' } -or- false,
  //         data: Return data object, no envelope
};
```

The `create` method should be written as follows:

```javascript
Conn.prototype.create = function (name, file, cb) {
  // name => Name property passed in multi-part body
  // file => The binary file passed in multi-part body
  // cb => Callback which accepts (err, data) as arguments:
  //         err: { code: 404, message: 'Not found' } -or- false,
  //         data: Return data object, no envelope
};
```

The `update` method should be written as follows:

```javascript
Conn.prototype.update = function (blob, name, file, cb) {
  // blob => name/path of blob
  // name => Name property passed in multi-part body (or false)
  // file => The binary file passed in multi-part body (or false)
  // cb => Callback which accepts (err, data) as arguments:
  //         err: { code: 404, message: 'Not found' } -or- false,
  //         data: Return data object, no envelope
};
```

The `remove` method should be written as follows:

```javascript
Conn.prototype.remove = function (blob, cb) {
  // blob => name/path of blob
  // cb => Callback which accepts (err, data) as arguments:
  //         err: { code: 404, message: 'Not found' } -or- false,
  //         data: Return data object, no envelope
};
```