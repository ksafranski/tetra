# Node BaaS

RESTful Back-End as a Service platform built entirely in Node.JS.

## Installation

After cloning or pulling the contents of the system, run `npm install` to 
install all dependencies.

## Usage

The system works off a version-schema system which allows easy development 
of versioned RESTful APIs.

---

### Users

The built-in user system allows creation and management of users who are authorized 
to access the API.

Requests to the user system can be made against:

```
http://youserver.com:NNNN/user/
```

#### Read

To read users simply make a `GET` request against the user endpoint. Additionally 
you can specify a username to only retrieve a certain user account:

```
http://youserver.com:NNNN/user/jsmith
```

#### Create

Sending a `POST` request to the user endpoint will create a user. Users follow the 
schema:

```json
"jsmith": {
  "password": "XXXXXXXXXXX",
  "type": 0,
  "data": { ... }
}
```

The key is the username/login, the password is an SHA encrypted password string, 
type can be either `0` (administrative) or `1` (standard), and the `data` property 
is a schema-less object for storing and user information required.

**Administrative**: Has the ability to access all data, including users and schemas

**Standard**: Only has access to API (data) endpoints

#### Update

Update (`PUT`) requests can be made by specifying the user in the URL then posting 
the data to be modified (supports partials).

#### Delete

Deleting (`DELETE`) requests are similar to update where the username to delete 
should be specified in the last place on the URL.

---

### Schemas

Schemas are simply JSON documents that specify the format of data being 
accessed or modified at that particular endpoint. Editing schemas can be done 
using RESTful calls.

While defining the structure of documents, schemas also provide basic validation 
for types `string`, `number`, `boolean`, `array`, and `json`.

#### Read

To return the JSON schema for v1's `example` schema, use the following:

```
GET: http://yourserver.com:NNNN/schema/v1/example
```

#### Create

To create a new schema on v1 named `example1`, use the following:

```
POST: http://yourserver.com:NNNN/schema/v1/example1
BODY:
  document= 
    {
      "foo": "string",
      "bar": "boolean",
      "quz": "array"
    }
```

#### Update

To update the `example1` schema created in the previous example, use the following: 

```
PUT: http://youserver.com:NNNN/schema/v1/example1
BODY:
  document=
    {
      "foo": "number"
    }
```

The above would change the `foo` property from a `string` to a `number`. The 
system supports partials so the full schema is not required in the `document`.

#### Delete

To delete the `example1` schema, use the following:

```
DELETE: http://yourserver.com:NNNN/schema/v1/example1
```

---

### Documents (API)

After defining schemas, the documents can then be accessed. All actions will be 
tested against the schemas to ensure data structure and property values.

#### Read

To read all documents in v1's `example` schema, use the following:

```
GET: http://yourserver.com:NNNN/api/v1/example
```

To read a specific, or subset of documents there are several methods:

##### By ID

Each document will have an `_id` parameter common amongst NoSQL document stores 
which can be used to access a specific document:

```
GET: http://yourserber.com:NNNN/api/v1/example/1234567890
```

##### By Search

To query for documents matching certain parameters, supply a querystring:

```
GET: http://yourserver.com:NNNN/api/v1/example?foo=1
```

The above would return all documents where `foo=1`. Additionally, parameters for 
searching can be appended using `&`.

#### Create

To create a new document, use the following:

```
POST: http://yourserver.com:NNNN/api/v1/example
BODY:
  foo = 'apple'
  bar = 'orange'
  ...
```

Any body parameters will be evaluated against the schema and passing data-sets 
will be added as a document.

#### Update

Similar to the create method, documents can be updated. The format of the `GET` 
requests can be used in the URI to specify which documents to update, i.e. all, 
a specific document (by ID), or a subset based on search.

```
PUT: http://yourserver.com:NNNN/api/v1/example/1234567890
BODY:
  foo = 'banana'
```

The above would update the document with `_id = 1234567890` with the `BODY` 
parameters specified. The service supports partials so the full document is not 
required.

#### Delete

Documents can be deleted using the same format of URI as shown in the `GET` examples; 
specifying all, by ID, or by query.

```
DELETE: http://yourserver.com:NNNN/api/v1/example/1234567890
```

The above would delete the record with `_id = 1234567890`.

## License

This software is distributed under the MIT License and as such is free to use, 
distribute, and modify and is presented without warranty of any kind.