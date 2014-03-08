// run tests:    jasmine-node --forceexit ./test/

var async = require('async');

var redis = require("redis");
var client = redis.createClient();

var MkUtils = require('../app/lib/mkUtils.js');
var MkRedisEngine = require('../app/lib/mkRedisEngine.js');
var MkTable = require('../app/lib/mkTable.js');

var beforeAll = function(fn) { it('[beforeAll]', fn);}, afterAll = function(fn) { it('[afterAll]', fn);}; // goo.gl/IhV41V



describe('Redis Engine', function () {

    var engine = new MkRedisEngine(client);
    var Users = new MkTable(engine, 'users');

    beforeAll(function(done) {
        client.del('users', done);
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
            expectUserCount(1, done);
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
            expectUserCount(2, done);
        });
    });

    it('should FIND row(s)', function (done) {
        Users.find({ uid: '_uid01' }, function(err, res) {
            expect(res.result.length).toBeGreaterThan(0);
            done();
        });
    });

    it('should FIND ONE row', function (done) {
        Users.findOne({ uid: '_uid01' }, function(err, res) {
            expect(res.result.length).toBeGreaterThan(0);
            done();
        });
    });

    it('should FIND ALL', function (done) {
        Users.findAll(function(err, res) {
            expect(res.result.length).toBe(2);
            done();
        });
    });

    it('should UPDATE existing data', function (done) {
        Users.update({ uid: '_uid01' }, 'test updating', function(err, res) {
            Users.find({ uid: '_uid01' }, function(err, res) {
                expect(res.result).toBe('test updating');
                done();
            });
        });
    });

    it('should DELETE 1 row', function (done) {
        Users.delete({ uid: '_uid02'}, function(err, res) {
            expectUserCount(1, done);
        });
    });
});