var express = require('express');
var app = express();
app.use(express.static(__dirname));
app.use(express.static(__dirname + '../lib'));

var async = require('async');

var cql = require('node-cassandra-cql');
var dbClient = new cql.Client({hosts: ['localhost:9042'], keyspace: 'test'});

var MkCassandraEngine = require('./lib/mkCassandraEngine.js');
var MkTable = require('./lib/mkTable.js');



app.get('/', function (req, res) {
});

app.get('/v1/users', function (req, out) {
    var engine = new MkCassandraEngine(dbClient);
    var Users = new MkTable(engine, 'users');

    if (Object.keys(req.query).length === 0) {
        Users.findAll(function (err, res) {
            out.send(res);
        });
    } else {
        Users.find(req.query, function (err, res) {
            out.send(res);
        });
    }
});

app.listen(3000);