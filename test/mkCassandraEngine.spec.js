// run tests:    jasmine-node --forceexit ./test/

var async = require('async');

var cql = require('node-cassandra-cql');
var dbClient = new cql.Client({hosts: ['localhost:9042']});

var MkUtils = require('../app/lib/mkUtils.js');
var MkCassandraEngine = require('../app/lib/mkCassandraEngine.js');
var MkTable = require('../app/lib/mkTable.js');

var beforeAll = function(fn) { it('[beforeAll]', fn);}, afterAll = function(fn) { it('[afterAll]', fn);}; // goo.gl/IhV41V



describe('Cassandra Engine', function () {

    var engine = new MkCassandraEngine(dbClient);
    var Users = new MkTable(engine, 'users');

    beforeAll(function(done) {
        var sqls = [
            //"DROP KEYSPACE test;",
            "CREATE KEYSPACE test WITH REPLICATION = { 'class':'SimpleStrategy', 'replication_factor': 1 };",
            "USE test;",
            "DROP TABLE IF EXISTS users;",
            "CREATE TABLE users (uid text,	username text,	password text, zipcode int, age int, PRIMARY KEY(uid) );",
            "CREATE INDEX users_zipcode_idx ON users (zipcode);",
            "CREATE INDEX users_age_idx ON users (age);",
            "INSERT INTO users(uid, username, password, zipcode, age) VALUES('_uid00', '_test00', '00', 91010, 20);"];
        MkUtils.execScripts(dbClient, sqls, done);
    });

    var expectUserCount = function(n, done) {
        Users.count(function(err, res) {
            expect(res.result).toBe(n);
            done();
        });
    };

    it('should INSERT 1 row', function (done) {
        Users.insert({
            uid: '_uid01',
            username: '_test01',
            password: '11',
            zipcode: 94040,
            age: 30
        }, function(err, res) {
            expect(err.error).toBe(null);
            expectUserCount(2, done);
        });
    });

    it('should INSERT 1 more row', function (done) {
        Users.insert({
            uid: '_uid02',
            username: '_test02',
            password: '22',
            zipcode: 94040,
            age: 40
        }, function(err, res) {
            expect(err.error).toBe(null);
            expectUserCount(3, done);
        });
    });

    it('should FIND row(s)', function (done) {
        Users.find({ zipcode: 94040 }, function(err, res) {
            expect(res.result.length).toBe(2);
            expect(res.result[0].zipcode).toBe(94040);
            done();
        });
    });

    it('should FIND ONE row', function (done) {
        Users.findOne({ zipcode: 94040 }, function(err, res) {
            expect(res.result.zipcode).toBe(94040);
            done();
        });
    });

    it('should FIND ONE using SQL', function (done) {
        Users.findOneWhere('uid = ? AND zipcode = ?', ['_uid01', 94040], function(err, res) {
            expect(res.result.zipcode).toBe(94040);
            done();
        });
    });

    it('should FIND with IN keyword', function (done) {
        Users.find({ uid: { $in: ['_uid01', '_uid02'] } }, function(err, res) {
            expect(res.result.length).toBe(2);
            done();
        });
    });

    it('should FIND ALL', function (done) {
        Users.findAll(function(err, res) {
            expect(res.result.length).toBe(3);
            done();
        });
    });

    it('should FIND using SQL', function (done) {
        Users.findWhere('uid = ? AND zipcode = ?', ['_uid01', 94040], function(err, res) {
            expect(res.result.length).toBe(1);
            done();
        });
    });

    it('should FIND with operators using SQL', function (done) {
        Users.findWhere('zipcode = ? AND age < ? ALLOW FILTERING', [94040, 35], function(err, res) {
            expect(res.result.length).toBe(1);
            done();
        });
    });

    it('should UPDATE existing data', function (done) {
        Users.update({age: 21, zipcode: 92020}, {uid: '_uid00'}, function(err, res) {
            expect(err).toBe(null);

            Users.findOne({uid: '_uid00'}, function(err, res) {
                expect(res.result.zipcode).toBe(92020);
                done();
            });
        });
    });

    it('should DELETE 1 row', function (done) {
        Users.delete({ uid: '_uid02'}, function(err, res) {
            expectUserCount(2, done);
        });
    });
});