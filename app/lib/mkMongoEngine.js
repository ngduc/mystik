/* jshint -W030 */
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define( ['./mkUtils'], function ( Utils ) {
    // DB client: https://github.com/learnboost/mongoose

    var MkMongoEngine = function ( client ) {
        var DEBUG = true;
        var _client = client;

        var processOptions = function( opts ) {
            return {
                sort: ( opts && opts.sort ? opts.sort : {} )
            };
        };

        return {
            find: function ( table, params, callback, options ) {
                var doneFn = ( callback ? callback : Utils.defer() );
                var Table = _client.model( table ),
                    opts = processOptions( options );

                Table.find( params ).setOptions( { lean: true } ).sort( opts.sort ).exec( function ( err, res ) {
                    Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                } );
                if ( doneFn && doneFn.promise ) return doneFn.promise;
            },
            findOne: function ( table, params, callback ) {
                var doneFn = ( callback ? callback : Utils.defer() );
                var Table = _client.model( table );

                Table.findOne( params ).setOptions( { lean: true } ).exec( function ( err, res ) {
                    Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                } );
                if ( doneFn && doneFn.promise ) return doneFn.promise;
            },
            findWhere: function ( table, whereClause, params, callback ) {
                return null; // not implemented
            },
            findOneWhere: function ( table, whereClause, params, callback ) {
                return null; // not implemented
            },
            findAll: function ( table, callback, options ) {
                return this.find( table, {}, callback, options );
            },
            insert: function ( table, obj, callback ) {
                var doneFn = ( callback ? callback : Utils.defer() );
                var Table = _client.model( table );
                var item = new Table(), k;
                for ( k in obj ) {
                    item[ k ] = obj[ k ];
                }
                item.save( function ( err, res ) {
                    Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                } );
                if ( doneFn && doneFn.promise ) return doneFn.promise;
            },
            update: function ( table, obj, params, callback ) {
                var doneFn = ( callback ? callback : Utils.defer() );
                var Table = _client.model( table );

                Table.findOne( params ).exec( function ( err, res ) {
                    if ( res ) {
                        for ( var k in obj ) {
                            console.log( k, obj[ k ] );
                            res[ k ] = obj[ k ];
                        }
                        res.save( function ( err, res ) {
                            Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                        } );
                    }
                } );
                if ( doneFn && doneFn.promise ) return doneFn.promise;
            },
            count: function ( table, callback ) {
                var doneFn = ( callback ? callback : Utils.defer() );
                var Table = _client.model( table );

                Table.count( {}, function ( err, res ) {
                    Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                } );
                if ( doneFn && doneFn.promise ) return doneFn.promise;
            },
            delete: function ( table, params, callback ) {
                var doneFn = ( callback ? callback : Utils.defer() );
                var Table = _client.model( table );

                Table.remove( params, function ( err, res ) {
                    Utils.done( doneFn, err, res );
                } );
                if ( doneFn && doneFn.promise ) return doneFn.promise;
            }
        };
    };

    return MkMongoEngine;
} );