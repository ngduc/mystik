// --- RUN: npm test

var redis = require( 'redis' ),
    client = redis.createClient();

var engine = new require( '../app/lib/mkRedisTextEngine' )( client ),
    MkTable = require( '../app/lib/mkTable' );

var beforeAll = function(fn) { it( '[beforeAll]', fn);}, afterAll = function(fn) { it( '[afterAll]', fn);}; // goo.gl/IhV41V

describe( 'Redis Engine for Text-Hash', function () {
    var Tokens = new MkTable( engine, 'unit_test_redis_text' );

    beforeAll( function ( done ) {
        client.del( 'unit_test_redis_text', done );
    } );

    var expectCount = function ( n, done ) {
        Tokens.count().then( function ( res ) {
            expect( res.result ).toBe( n );
            done();
        } );
    };

    it( 'can add a User', function ( done ) {
        Tokens.insert( { id: 'user-01', token: 'abc', age: '15' } ).then( function () {
            // user-01:token    'abc'
            // user-01:age      30
            expectCount( 2, done );
        } );
    } );

    it( 'can add another User', function ( done ) {
        Tokens.insert( { id: 'user-02', token: 'def', age: '30' } ).then( function () {
            expectCount( 4, done );
        } );
    } );

    it( 'can add another User', function ( done ) {
        Tokens.insert( { id: 'user-03', token: 'ghi', age: '30' } ).then( function () {
            expectCount( 6, done );
        } );
    } );

    it( 'can find a Token by Id', function ( done ) {
        Tokens.find( { id: 'user-02' } ).then( function ( res ) {
            expect( res.result ).toBeDefined();
            expect( res.result.token ).toBe( 'def' );
            done();
        } );
    } );

    it( 'can find User(s) by Token value', function ( done ) {
        Tokens.find( { token: 'abc' } ).then( function ( res ) {
            expect( res.result ).toBeDefined();
            expect( res.result.length ).toBe( 1 );
            expect( res.result[0].token ).toBe( 'abc' );
            done();
        } );
    } );

    it( 'can update User', function ( done ) {
        Tokens.update( { token: 'def2', age: '15' }, { id: 'user-03' } ).then( function () {
            Tokens.find( { id: 'user-03' } ).then( function ( res ) {
                expect( res.result.age ).toBe( '15' );
                done();
            });
        } );
    } );

    it( 'can delete a User', function ( done ) {
        Tokens.delete( { id: 'user-02' } ).then( function ( res ) {
            expectCount( 4, done );
        } );
    } );

} );
