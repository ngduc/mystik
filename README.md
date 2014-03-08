Mystik
======
[![Build Status](https://travis-ci.org/ngduc/mystik.png?branch=master)](https://travis-ci.org/ngduc/mystik)

Mystik (MkTable) is a generic Javascript DAO (Data Access Objects) for database systems including NoSQL databases, Redis, NodeJS support and REST API web service handling.

It also allows using the same query syntax on client and server side to get data. Data could come from database or APIs in JSON format.

**NOTE:** All working features are covered in unit tests. Please help implement engines for other databases or fix defects. Thanks.

## Install

```sh
    $ git clone https://github.com/ngduc/mystik.git
    $ npm install
```

**NOTE:** Make sure you have Database installed and running. The example code requires Cassandra running and 'test' keyspace created:

```sh
    $ cd cassandra/bin
    $ printf "CREATE KEYSPACE test; \n" > ./testsetup.cql
    $ ./cassandra-cli -h localhost -p 9160 -f ./testsetup.cql
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

## Engines

Engine (Database Engine) is the persistence layer. It provides implementations for the interface methods of MkTable.

Engine is supposed to be swapped out easily to use another Database or Data source.

Engine methods should return result(s) or error(s) in a wrapper format like examples below:

```
    Find() result(s):
    {
        "timestamp": "1393728392387",
        "result": [
            {
                "uid": "_uid0111",
                "age": null,
                "password": "wialrqxkrnovfgvi",
                "username": null,
                "zipcode": null
            }
        ]
    }

    Error:
    {
        "code": 0123,
        "message": "Some error message",
        "error" {
            // error object of the DB driver
        }
    }
```

## Running Tests

Make sure you have Database installed and running. To run unit tests:

```sh
    $ jasmine-node ./test/

    # to stop the jasmine-node process when it is finished, use this:
    $ jasmine-node --forceexit ./test/
```

## Dependencies

    - express
    - node requirejs
    - amdefine
    - jasmine-node - for unit testing.
    - async - for unit testing.
    - node-cassandra-cql - if Cassandra is used.
    - redis/hiredis - if Redis is used.

## License

(MIT License)