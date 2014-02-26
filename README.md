Mystik
======

Generic Javascript DAO (Data Access Objects) classes for database systems including NoSQL databases, NodeJS support and REST API web service handling

NOTE: This is a work in progress. All working features are covered in unit tests. Please help implement engines for other databases or fix defects. Thanks.

## Install

**NOTE:** You need to have NodeJS, Database (Cassandra, etc.) installed and running.

```sh
  $ git clone https://github.com/ngduc/mystik.git
  $ npm install
```

## Usage

This is a very basic example:

```
    var MkCassandraEngine = require('lib/mkCassandraEngine.js');
    var MkTable = require('lib/mkTable.js');

    var engine = new MkCassandraEngine(dbClient);
    var Users = new MkTable(engine, 'users');

    Users.find({ zipcode: 94040 }, function(err, res) {
        // result (res) is an array of rows in json
    })

    Users.update({age: 21, zipcode: 92020}, {uid: '_uid00'}, function(err, res) {
        // update user which has uid = '_uid00'
    })
```

## Running Tests

```sh
  $ jasmine-node ./test/

  # to stop the jasmine-node process when it is finished, use this:
  $ jasmine-node --forceexit ./test/
```

## Dependencies

1. express
2. node requirejs
3. amdefine
4. async
5. node-cassandra-cql
6. jasmine-node

## License

(MIT License)