Mystik
======
[![Build Status](https://travis-ci.org/ngduc/mystik.png?branch=master)](https://travis-ci.org/ngduc/mystik)

Mystik (MkTable) is a generic Javascript DAO (Data Access Objects) for database systems including NoSQL databases, NodeJS support and REST API web service handling.

It also allows using the same query syntax on client and server side to get data. Data could come from database or APIs in JSON format.

**NOTE:** This is a work in progress. All working features are covered in unit tests. Please help implement engines for other databases or fix defects. Thanks.

## Install

**NOTE:** You need to have NodeJS, Database (Cassandra, etc.) installed and running.

```sh
    $ git clone https://github.com/ngduc/mystik.git
    $ npm install
```

## Usage

This is a very basic NodeJS example. Prepare DB connection:

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

See more interface methods in [mkTable.js](app/lib/mkTable.js)

### Client Side

From client side, you will need to use MkRestEngine to make call to "APIs" (NodeJS) which in turn will query database and return JSON data.

See [this example](app/index.html)

## Running Tests

Make sure you have Database installed and running. Current unit tests for Cassandra require Cassandra running and 'test' keyspace created:

```sh
    $ cd cassandra/bin
    $ printf "CREATE KEYSPACE test; \n" > ./testsetup.cql
    $ ./cassandra-cli -h localhost -p 9160 -f ./testsetup.cql
```

To run unit tests:

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