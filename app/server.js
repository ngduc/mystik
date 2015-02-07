var async = require( 'async' ),
    express = require( 'express' );

var app = express(),
    bodyParser = require('body-parser');
app.use( express.static( __dirname ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
    extended: true
} ) );

// --- Test with Cassandra Engine:
//var cql = require( 'node-cassandra-cql' );
//var db = new cql.Client( {hosts: ['localhost:9042'], keyspace: 'test'} );

// --- Test with MongoDB Engine:
var mongoose = require( 'mongoose' ),
    dbURL = 'mongodb://localhost/MystikTest',
    db = mongoose.connect( dbURL ),
    UserSchema = new mongoose.Schema( {
        uid: String,
        username: String,
        password: String,
        zipcode: Number,
        age: Number
    } );
db.model( 'users', UserSchema );

var engine = new require( './lib/mkMongoEngine.js' )( db ),
    MkTable = require( './lib/mkTable.js' );



var Users = new MkTable( engine, 'users' );

app.get( '/', function ( req, res ) {
} );

// Demonstrate REST API:
// GET: query data - POST: insert data - PUT: update data - DELETE: delete data

app.get( '/v1/users', function ( req, out ) {
    if ( Object.keys( req.query ).length === 0 ) {
        Users.findAll( function ( err, res ) {
            out.send( res );
        } );
    } else {
        Users.find( req.query, function ( err, res ) {
            out.send( res );
        } );
    }
} );

app.post( '/v1/users', function ( req, out ) {
    Users.insert( req.body, function ( err, res ) {
        out.send( res );
    } );
} );

app.put( '/v1/users', function ( req, out ) {
    Users.update( req.body, req.query, function ( err, res ) {
        Users.find( req.query, function ( err, res ) {
            out.send( res );
        } );
    } );
} );

app.delete( '/v1/users', function ( req, out ) {
    Users.delete( req.query, function ( err, res ) {
        out.send( res );
    } );
} );

console.log( 'Listening on port 3000 ' );
app.listen( 3000 );