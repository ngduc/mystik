/* jshint -W030 */
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['./mkUtils'], function (Utils) {
    // DB client: https://github.com/learnboost/mongoose

    var MkMongoEngine = function (client) {
        var DEBUG = true;
        var _client = client;

        return {
            find: function (table, params, callback) {
                var doneFn = ( callback ? callback : Utils.defer() );
                var Table = _client.model( table );

                Table.find( {}, params, function( err, res ) {
                    Utils.done( doneFn, err, res );
                });
                if ( doneFn && doneFn.promise ) return doneFn.promise;
            },
            findOne: function (table, params, callback) {
                var doneFn = ( callback ? callback : Utils.defer() );
                var Table = _client.model( table );

                Table.findOne( {}, params, function( err, res ) {
                    Utils.done( doneFn, err, res );
                });
                if ( doneFn && doneFn.promise ) return doneFn.promise;
            },
            findWhere: function (table, whereClause, params, callback) {
                return null; // not implemented
            },
            findOneWhere: function (table, whereClause, params, callback) {
                return null; // not implemented
            },
            findAll: function (table, callback) {
                return this.find( table, {}, callback);
            },
            insert: function (table, obj, callback) {
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

                Table.findOne( {}, params, function( err, res ) {
                    for ( var k in obj ) {
                        res[ k ] = obj[ k ];
                    }
                    res.save( function ( err, res ) {
                        Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                    } );
                });
                if ( doneFn && doneFn.promise ) return doneFn.promise;
            },
            count: function (table, callback) {
                var doneFn = ( callback ? callback : Utils.defer() );
                var Table = _client.model( table );

                Table.count( {}, function( err, res ) {
                    Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                });
                if ( doneFn && doneFn.promise ) return doneFn.promise;
            },
            delete: function (table, params, callback) {
                var doneFn = ( callback ? callback : Utils.defer() );
                var Table = _client.model( table );

                Table.remove( params, function( err, res ) {
                    Utils.done( doneFn, err, res );
                });
                if ( doneFn && doneFn.promise ) return doneFn.promise;
            }
        };
    };

    return MkMongoEngine;
});