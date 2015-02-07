Mystik
======
[![Build Status](https://travis-ci.org/ngduc/mystik.png?branch=master)](https://travis-ci.org/ngduc/mystik)

Mystik (MkTable) is a generic Javascript DAO (Data Access Objects) for database systems including NoSQL databases, Redis, NodeJS support and REST API web service handling.

It also allows using the same query syntax on both client and server side to get data. Data could come from database or APIs in JSON format.

**NOTE:** All working features are covered in unit tests. Please help implement engines for other databases or fix defects. Thanks.

## Install

```sh
    $ npm install mystik-dao --save
OR
    $ git clone https://github.com/ngduc/mystik.git
    $ npm install
```

## Usage

This is a very basic NodeJS example. Prepare DB connection:

```
    var engine = new require( 'lib/mkMongoEngine' )( db ),
        MkTable = require( 'lib/mkTable' );

    var Users = new MkTable(engine, 'users');   // you should have 'users' table/schema defined.
```

Do some queries and updating data on [users] table:

```
    Users.find( { zipcode: 94040 } ).then( function( res ) {
        // res.result is an array of rows in JSON.
    });

    Users.update( { age: 21, zipcode: 92020 }, { uid: '_uid00' } ).then( function( res ) {
        // update user which has uid = '_uid00'
    });
```

See more interface methods in [mkTable.js](app/lib/mkTable.js)

### Client Side

From client side, you can use MkRestEngine to make call to "APIs" (NodeJS) which in turn will query database and return JSON data.

The query syntax is the same as back end.

See [this example](app/index.html)

## Engines

Engine (Database Engine) is the persistence layer. It provides implementations for the interface methods of MkTable.

Engine is supposed to be swapped out easily to use another Database or Data source.

Engine methods should return result(s) or error(s) in the same wrapper format like examples below:

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

The Demo can be run to demonstrate client side APIs for CRUD: (require MongoDB or Cassandra DB)

```sh
    # start the Demo on port 3000 - http://localhost:3000
    $ node app/server.js
```

## Dependencies

    - Q for promise.
    - node-cassandra-cql - if Cassandra is used.
    - redis/hiredis - if Redis is used.
    - mongoose - if MongoDB is used.
    - jasmine-node - for unit testing.

## License

(MIT License)