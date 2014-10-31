// run test: jasmine-node --forceexit ./test/mkMongoEngine.spec.js

var mongoose = require( 'mongoose' );
var db = mongoose.connect( 'mongodb://localhost/unit_test_mongo' );

var UserSchema = new mongoose.Schema( {
    uid: String,
    username: String,
    password: String,
    zipcode: Number,
    age: Number,
    date: { type: Date, default: Date.now }
} );
db.model( 'users', UserSchema );    // collection "users" will be created.


var MkUtils = require( '../app/lib/mkUtils.js' ),
    engine = new require( '../app/lib/mkMongoEngine' )( db ),
    MkTable = require( '../app/lib/mkTable' );

var beforeAll = function(fn) { it( '[beforeAll]', fn);}, afterAll = function(fn) { it( '[afterAll]', fn);}; // goo.gl/IhV41V

describe( 'MongoDB Engine', function () {
    var Users = new MkTable( engine, 'users' );

    beforeAll( function( done ) {
        Users.delete( {} );
        done();
    });

    var expectUserCount = function( n, done ) {
        Users.count()
            .then( function( res ) {
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
        } ).then( function( res ) {
            expect( res.result ).not.toBeNull();
            expectUserCount( 1, done );
        });
    });

    it( 'should INSERT 1 more row', function ( done ) {
        Users.insert( {
            uid: '_uid02',
            username: '_test02',
            password: '22',
            zipcode: 94040,
            age: 40
        } ).then( function( res ) {
            expect( res.result ).not.toBeNull();
            expectUserCount( 2, done );
        });
    });

    it( 'should FIND row(s)', function ( done ) {
        Users.find( { zipcode: 94040 } )
            .then( function( res ) {
                expect( res.result.length ).toBe( 2 );
                expect( res.result[0].zipcode ).toBe( 94040 );
                done();
            });
    });

    it( 'should FIND ONE row', function ( done ) {
        Users.findOne({ zipcode: 94040 } )
            .then( function( res ) {
                expect( res.result.zipcode ).toBe( 94040 );
                done();
            });
    });

    // TODO: this throws error: Can't canonicalize query: BadValue Unsupported projection option
    /* it( 'should FIND with IN keyword', function ( done ) {
        Users.find( { uid: { $in: ['_uid01', '_uid02'] } }, function(err, res) {
            console.log(err, res);
            expect(res.result.length).toBe(2);
            done();
        });
    }); */

    it( 'should FIND ALL', function ( done ) {
        Users.findAll()
            .then( function( res ) {
                expect( res.result.length ).toBe( 2 );
                done();
            });
    });

    it( 'should FIND ALL with SORT option', function ( done ) {
        Users.findAll( null, { sort: { 'age': -1 } } )
            .then( function( res ) {
                expect( res.result.length ).toBe( 2 );
                expect( res.result[0].age ).toBe( 40 );
                done();
            });
    });

    it( 'should UPDATE existing data', function ( done ) {
        Users.update( {age: 21, zipcode: 92020}, {uid: '_uid01'} )
            .then( function( res ) {
                expect( res.result ).not.toBeNull();

                Users.findOne( {uid: '_uid01'} )
                    .then( function( res ) {
                        expect( res.result.zipcode ).toBe( 92020 );
                        done();
                    });
            });
    });

    it( 'should DELETE 1 row', function ( done ) {
        Users.delete( { uid: '_uid02'} )
            .then( function( res ) {
                expectUserCount( 1, done );
            });
    });
});