![Codeship Status for telepharm/nbaas](https://codeship.io/projects/b4fbc3d0-dde4-0131-c2ca-42d485117a92/status)

# Tetra

Back-End as a Service platform built in Node.JS and developed to allow 
for simplified deployment, versioning and management of RESTful APIs.

## Contents

* [Installation](#installation)
* [Usage](#usage)
* [Req/Res](#requests--responses)
* [Logging](#logging)
* [SSL](#ssl)
* [Users](#users) > [Read](#read-user) / [Create](#create-user) / [Update](#update-user) / [Delete](#delete-user)
* [Sessions](#sessions) > [Read](#read-session) / [Create](#create-session) / [Delete](#delete-session)
* [Versions](#versions) > [Read](#read-version) / [Create](#create-version) / [Update](#update-version) / [Delete](#delete-version)
* [Schemas](#schemas) > [Read](#read-schema) / [Create](#create-schema) / [Update](#update-schema) / [Delete](#delete-schema)
* [Documents](#documents) > [Read](#read-document) / [Create](#create-document) / [Update](#update-document) / [Delete](#delete-document)
  * [Queries](#read-document)
    * [By ID](#by-id)
    * [Multiples](#multiples)
    * [Search](#search)
    * [Order](#order)
* [Blobs](#blobs) > [Read](#read-blob) / [Create](#create-blob) / [Update](#update-blob) / [Delete](#delete-blob)
* [Contributing](#contributing)
* [License](#license)
  
## Installation

After cloning or pulling the contents of the system, run `npm install` to 
install all dependencies.

The adapters by default support local document storage (via [NeDB](https://github.com/louischatriot/nedb)), 
local (node-fs) blob storage and local logging via [winston](https://github.com/flatiron/winston). 

The system also comes with an adapter for [Mongo](http://www.mongodb.com) which 
can be activated by editing the `/conf/service.json` file. ([More info...](adapters/documents/mongo/README.md))

The service is made to run 'out of the box' with little to no configuration required, 
allowing easy setup and testing.

Starting the service can be done by running `node index.js`.

Additionally, `preinstall` will install [node-forever](https://github.com/nodejitsu/forever) 
allowing the service to be started as a forever process with `npm run service`.

## Usage

The system works off a version-schema system which allows easy development 
of versioned RESTful APIs. The workflow involves 

1. Creating and managing [users](#users) who can access and administer the service
2. Creating and managing [versions](#versions) which house schema sets
3. Creating and managing [schemas](#schemas) which control data endpoints for the API
4. Working with [documents](#documents) and [blobs](#blobs) via RESTful interactions with the API

### Service Configuration

The service can be configured via `/conf/service.json` which should look similar 
to the following:

```javascript
{
  "name": "API",
  "port": 8000,
  "authentication": true,
  "cors": "*",
  "secret": "abcdef1234567890",
  "schemas": {
    "strict": true,
    "types": ["string", "number", "boolean", "array", "json"]
  },
  "documents": {
    "adapter": "local",
    "path": "documents/"
  },
  "blobs": {
    "adapter": "local",
    "path": "blobs/"
  },
  "logs": {
    "adapter": "local",
    "path": "logs/"
  }
}
```

By default, the system includes adapters for:

* Documents via a local (nedb) adapter
* Blobs via a local (node-fs) adapter
* Logs via a local (bunyan) adapter

For more information on adapters and writing custom adapters for other data or 
document storage services, see the [adapters documentation](/adapters).

### Requests / Responses

If `/conf/service.json` has `authentication` set to `true` (strongly recommended) 
BasicAuth is required to access the API. Users can be created/modified/deleted via 
the [user](#users) endpoint. Additionally, [sessions](#sessions) can be used for 
authentication and user state maintenance.

All `POST` and `PUT` requests (except to `blob` endpoints) require that the header 
`Content-Type` is set to `application/json`. The system will return a `415` 
error if this is not correctly set.

Responses will come back in one of two formats:

1. JSON data response (success)
2. JSON envelope (error) with `response` property containing details

The system was developed to follow best practices for RESTful API's as closely as 
possible, including accurate and diverse HTTP-Status codes, non-enveloped return data, 
proper use of verbs/methods, proper use of req/res headers, etc.

---

### Logging

The system includes a local logging system through Express middleware and Bunyan. 
The log adapter is activated by its presence in the `/conf/service.json` file. If 
the logging service is not needed simply remove the `logs` property from the 
config file and the middleware will not run.

---

### SSL

The service supports SSL, and in fact, it is highly recommended SSL's be utilized, 
especially in production.

To utilize SSL certificates simply place the key (`ssl.key`) and cert (`ssl.crt`) 
files in the `conf/certs/` directory. Optionally, if your certificate uses a CA 
certificate you can place it (`ssl.pem`) in the same directory.

The system will automatically check for the presence of certificates and instruct 
HTTPS services when the files are present.

---

### Users

**DEFAULT ACCOUNT: username: admin, password: password123**

The built-in user system allows creation and management of users who are authorized 
to access the API.

Requests to the user system can be made against:

```
GET: http://youserver.com:NNNN/user/
```

#### Read User

To read users simply make a `GET` request against the user endpoint. Additionally 
you can specify a username to only retrieve a certain user account:

```
GET: http://youserver.com:NNNN/user/jsmith
```

The user endpoint supports basic querying as well, for example:

```
GET: http://yourserver.com:NNNN/user?search={"type": { "$lt": 1 }}
```

The above would retrieve users with `type` less than 1. To maintain consistency 
with other queries within the system the following operators are supported; 
`$gt`, `$lt`, `$gte`, `$lte`, `$ne` as well as direct matches: `{ "username": "foo" }`.

#### Create User

Sending a `POST` request to the user endpoint will create a user. User's follow the 
schema:

```
POST: http://yourserver.com:NNNN/user
BODY:
  {
    "username": "jsmith",
    "password": "XXXXXXXXXXX",
    "type": 0,
    "data": { ... }
  }
```

The username must be unique, and the system will return a `409` if the specified 
username already exists.

The password is a plain-text string which will be encrypted by the service for 
storage.
 
Type can be either `0` (administrative) or `1` (standard), and the `data` property 
is a schema-less object for storing any additional user information required.

**Administrative**: Has the ability to access all data, including users, version, and schemas

**Standard**: Only has access to API (document & blob) endpoints

#### Update User

Update (`PUT`) requests can be made by specifying the user in the URL then posting 
the data to be modified.

```
PUT: http://yourserver.com:NNNN/user/jsmith
BODY:
  {
    "password": "YYYYYYYYYYY"
  }
```

The `PUT` method supports the same queries as the `GET` method.

*NOTE: The `PUT` method supports partial updates*

#### Delete User

Deleting (`DELETE`) requests are similar to update where the username to delete 
should be specified in the last place on the URL:

```
DELETE: http://yourserver.com:NNNN/user/jsmith
```

The `DELETE` method supports the same queries as the `GET` method.

---

### Sessions

Instead of BasicAuth, sessions can be used to authenticate users on the system. 
Sessions support `GET`, `POST`, and `DELETE` methods.

#### Read Session

To retrieve the current user session:

```
GET: http://yourserver.com:NNNN/session
```

#### Create Session

To create a new session (authenticate a user):

```
POST: http://yourserver.com:NNNN/session
BODY: 
  {
    "username": "jsmith",
    "password": "XXXXXXXXXXX"
  }
```

#### Delete Session

To end a session (logout):

```
DELETE: http://yourserver.com:NNNN/session
```

---

### Versions

To support ongoing development the system supports a basic versioning system. Versions 
are directory with their contents being the schemas for all available endpoints.

Versions can be manipulated using REST calls against the following:

#### Read Version

Any `GET` request made will read either all available versions:

```
http://yourserver.com:NNNN/version
```

Or can request a specific version:

```
http://yourserver.com:NNNN/version/v1
```

The `GET` call (on success) will return the schemas associated with the versions
returned.

#### Create Version

A new version can be created by running:

```
POST: http://yourserver.com:NNNN/version
BODY: 
  {
    "name": "v2"
  }
```

Which would create the container/directory for a `v2` version.

#### Update Version

Versions can be updated by using the following:

```
PUT: http://youserver.com:NNNN/version/v2
BODY:
  {
    "name": "v3"
  }
```

Which would change the `v2` version to `v3`.

#### Delete Version

Versions (and their schemas) can be deleted via:

```
DELETE: http://yourserver.com:NNNN/version/v2
```

Which would delete the `v2` version. **IMPORTANT**: This will also delete the 
schemas associated with the version being deleted.

---

### Schemas

Schemas are JSON documents that specify the format of data being accessed or 
modified at that particular endpoint.

While defining the structure of documents, schemas also provide basic validation 
for types `string`, `number`, `boolean`, `array`, and `json`. This list can be 
adjusted in the `/conf/service.json` config file.

Additionally schemas can be set to `strict` in the `service.json` config file 
which will enforce that all data submitted match the key values in the schema (i.e. 
a user cannot submit data to keys which are *NOT* in the schema).

#### Read Schema

To return the JSON schema for v1's `example` schema, use the following:

```
GET: http://yourserver.com:NNNN/schema/v1/example
```

#### Create Schema

To create a new schema on v1 named `example1`, use the following:

```
POST: http://yourserver.com:NNNN/schema/v1
BODY:
  { 
    "name": "example1",
    "document": {
      "foo": {
        "required": true,
        "type": "string"
      },
      "bar": 
        "type": "boolean"
      },
      "quz": {
        "type": "array"
      }
    }
  }
```

#### Update Schema

To update the `example1` schema created in the previous example, use the following: 

```
PUT: http://youserver.com:NNNN/schema/v1/example1
BODY:
  {
    "name": "example2",
    "document": {
      "foo": {
        "type": "number"
      }
    }
  }
```

The above would change the name of the schema to `example2` and the `foo` property 
from a `string` to a `number`.

*NOTE: The `PUT` method supports partial updates*

#### Delete Schema

To delete the `example1` schema, use the following:

```
DELETE: http://yourserver.com:NNNN/schema/v1/example1
```

---

### Documents

After defining schemas, the documents can then be accessed and modified. All 
actions will be tested against the schemas to ensure data structure and property 
values.

#### Read Document

To read all documents in v1's `example` schema, use the following:

```
GET: http://yourserver.com:NNNN/document/v1/example
```

To read a specific, or subset of documents there are several methods:

##### By ID

Each document will have an `_id` parameter common amongst NoSQL document stores 
which can be used to access a specific document:

```
GET: http://yourserber.com:NNNN/document/v1/example/1234567890
```

##### Multiples

Querying a collection can be controlled through quesrysting parameters:

```
GET: http://yourserver.com:NNNN/document/v1/example?count=10&page=1
```

The above would return 10 documents starting at page 1.

##### Search

Querying for a specific match can be done with the `search` parameter:

```
GET: http://yourserver.com:NNNN/document/v1/example?search={"foo":"bar"}
```

Queries follow the Mongo-style operations such as `{ "field": { "$gt": 4 } }` allowing 
for `$gt`, `$lt`, `$gte`, `$lte`, `$ne`.

*Note: the search query must be formatted as JSON*

##### Order

To return based on a specific order, the `orderby` parameter can be used:

```
GET: http://yourserver.com:NNNN/document/v1/example?orderby={ "foo": "asc" }
```

The above would return data in ascending order based on the `foo` field. The 
inverse (descending) is called by changing the value to `desc`.

#### Create Document

To create a new document, use the following:

```
POST: http://yourserver.com:NNNN/document/v1/example
BODY:
  {
    "foo": "bar",
    "baz": "quz"
  }
```

Any body parameters will be evaluated against the schema and passing data-sets 
will be added as a document.

#### Update Document

Similar to the create method, documents can be updated. The format of the `GET` 
requests can be used in the URI to specify which documents to update, i.e. all, 
a specific document (by ID), or a subset based on search.

```
PUT: http://yourserver.com:NNNN/document/v1/example/1234567890
BODY:
  {
    "foo": "baz"
  }
```

The above would update the document with `_id = 1234567890` with the `BODY` 
parameters specified.

Additionally, updates can be made on multiple records by providing the `search` 
querystring in the same format utilized by the `GET` method.

*NOTE: The `PUT` method supports partial updates*

#### Delete Document

Documents can be deleted using the same format of URI as shown in the `GET` examples; 
specifying all, by ID, or by query.

```
DELETE: http://yourserver.com:NNNN/document/v1/example/1234567890
```

The above would delete the record with `_id = 1234567890`.

Additionally, deletions can be made on multiple records by providing the `search` 
querystring in the same format utilized by the `GET` method.

---

### Blobs

Blob storage can be used for storing documents in binary format. They can not 
be searched and have no schema or version, but support all other methods. Blob 
requests for `POST` and `PUT` should be made as `multipart` submissions.

#### Read Blob

To read out a blob it can be accessed by its name.

```
GET: http://yourserver.com:NNNN/blob/some_file
```

#### Create Blob

To create (add) a new blob, simply `POST` with request body `blob`:

```
POST: http://yourserver.com:NNNN/blob
BODY:
  name = some_file
  blob = [FILE]
```

#### Update Blob

The update (`PUT`) method follows the `POST`, simply replacing the blob:

```
PUT: http://yourserver.com:NNNN/blob/some_file
BODY:
  name = new_name
  blob = [FILE]
```

*NOTE: The `PUT` method supports partial updates*

#### Delete Blob

The delete simply removes the blob from the server:

```
DELETE: http://youserver.com:NNNN/blob/some_file
```

---

## Contributing

Contributions to this platform are welcomed and encouraged, however, please adhere 
to the following:

* Utilize the default `grunt` task to ensure code consistency
* Create issues in GitHub before addressing any features, fixes, etc to avoid conflicts
* Submit clear pull requests with testing details and a clear explanation of changes

#### Testing

The system comes with a test runner which utilizes [Restify](http://mcavage.me/node-restify) 
to run a battery of system tests against the API. The tests have been designed to 
ensure the core functionality of the system remains unbroken during ongoing development. 
Please run the tests before submitting pull requests for features or fixes.

Read the [testing documentation](/tests) for more information.

---

## License

This software is distributed under the MIT License and as such is free to use, 
distribute, and modify and is presented without warranty of any kind.