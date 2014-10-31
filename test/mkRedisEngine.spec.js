// run tests:    jasmine-node --forceexit ./test/

var redis = require( 'redis' ),
    client = redis.createClient();

var MkUtils = require( '../app/lib/mkUtils.js' ),
    engine = new require( '../app/lib/mkRedisEngine' )( client ),
    MkTable = require( '../app/lib/mkTable' );

var beforeAll = function(fn) { it( '[beforeAll]', fn);}, afterAll = function(fn) { it( '[afterAll]', fn);}; // goo.gl/IhV41V


describe( 'Redis Engine for JSON-Hash', function () {
    var Users = new MkTable( engine, 'unit_test_redis' );

    beforeAll( function ( done ) {
        client.del( 'unit_test_redis', done );
    } );


    var expectUserCount = function ( n, done ) {
        Users.count( function ( err, res ) {
            expect( res.result ).toBe( n );
            done();
        } );
    };


    it( 'should INSERT 1 row', function ( done ) {
        Users.insert( {
            uid: '_uid01',
            username: '_test01',
            password: '11',
            zipcode: 94040,
            age: 30
        } ).then( function ( err, res ) {
            expectUserCount( 1, done );
        } );
    } );

    it( 'should INSERT 1 more row', function ( done ) {
        Users.insert( {
            uid: '_uid02',
            username: '_test02',
            password: '22',
            zipcode: 94040,
            age: 40
        } ).then( function ( err, res ) {
            expectUserCount( 2, done );
        } );
    } );

    it( 'should FIND row(s) by Key', function ( done ) {
        Users.find( { id: '_uid01' } ).then( function ( res ) {
            expect( res.result.length ).toBeGreaterThan( 0 );
            done();
        } );
    } );

    it( 'should FIND ONE row by Key', function ( done ) {
        Users.findOne( { id: '_uid01' } ).then( function ( res ) {
            expect( res.result.length ).toBeGreaterThan( 0 );
            done();
        } );
    } );

    it( 'should FIND ALL', function ( done ) {
        Users.findAll().then( function ( res ) {
            expect( Object.keys( res.result ).length ).toBe( 2 );
            done();
        } );
    } );

    it( 'should UPDATE existing data', function ( done ) {
        Users.update( { id: '_uid01' }, '{ updated: 1 }' ).then( function ( res ) {
            Users.find( { id: '_uid01' } ).then( function ( res ) {
                expect( res.result ).toBe( '{ updated: 1 }' );
                done();
            } );
        } );
    } );

    it( 'should DELETE 1 row', function ( done ) {
        Users.delete( { uid: '_uid02' } ).then( function ( res ) {
            expectUserCount( 1, done );
        } );
    } );
} );