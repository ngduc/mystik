Mystik
======
[![Build Status](https://travis-ci.org/ngduc/mystik.png?branch=master)](https://travis-ci.org/ngduc/mystik)

Generic Javascript DAO (Data Access Objects) classes for database systems including NoSQL databases, NodeJS support and REST API web service handling.

**NOTE:** This is a work in progress. All working features are covered in unit tests. Please help implement engines for other databases or fix defects. Thanks.

## Install

**NOTE:** You need to have NodeJS, Database (Cassandra, etc.) installed and running.

```sh
    $ git clone https://github.com/ngduc/mystik.git
    $ npm install
```

## Usage

This is a very basic example. Prepare DB connection:

```
    var MkCassandraEngine = require('lib/mkCassandraEngine.js');
    var MkTable = require('lib/mkTable.js');

    var engine = new MkCassandraEngine(dbClient);
    var Users = new MkTable(engine, 'users');
```

Do some query and updating data on [users] table:

```
    Users.find({ zipcode: 94040 }, function(err, res) {
        // result (res) is an array of rows in JSON.
    });

    Users.findWhere('uid = ? AND zipcode = ?', ['_uid01', 94040], function(err, res) {
        // query data using SQL where clause.
    })

    Users.update({age: 21, zipcode: 92020}, {uid: '_uid00'}, function(err, res) {
        // update user which has uid = '_uid00'
    });
```

See more interface methods in mkTable.js

## Running Tests

Make sure you have Database installed and running. Current unit tests for Cassandra require Cassandra running and 'test' keyspace created.

```sh
    $ jasmine-node ./test/

    # to stop the jasmine-node process when it is finished, use this:
    $ jasmine-node --forceexit ./test/
```

## Dependencies

    - express
    - node requirejs
    - amdefine
    - node-cassandra-cql - if Cassandra is used.
    - jasmine-node - for unit testing.
    - async - for unit testing.

## License

(MIT License)