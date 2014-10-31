/* jshint -W030 */

// Redis Engine: store data as HashKey:field - fieldValue (text).

// Defines a module that works in CommonJS and AMD: https://github.com/umdjs/umd/blob/master/nodeAdapter.js
if ( typeof module === 'object' && typeof define !== 'function' ) {
    var define = function ( factory ) {
        module.exports = factory( require, exports, module );
    };
}

define( function ( require, exports, module ) {
    var Utils = require( './mkUtils.js' ),
        Q = require( 'q' );

    var MkRedisTextEngine = function ( client ) {
        var DEBUG = true;
        var _client = client;

        return {
            findById: function ( table, id, callback ) {
                var doneFn = callback || Utils.defer();

                _client.hscan( [table, '0', 'match', id + ':*'], function ( err, res ) {
                    var obj = {};
                    if ( res && res[1] ) {
                        var arr = res[1],
                            key = '';
                        obj.id = id;
                        for ( var i = 0; i < arr.length / 2; i++ ) {
                            key = arr[ i * 2 ].slice( arr[ i * 2 ].indexOf( ':' ) + 1 );
                            obj[ key ] = arr[ i * 2 + 1 ];
                        }
                    }
                    Utils.done( doneFn, null, obj );
                } );
                return ( doneFn && doneFn.promise ? doneFn.promise : {} );
            },
            find: function ( table, conds, callback ) {
                // TODO: Fix this: only support 1 condition for now:
                var that = this,
                    doneFn = callback || Utils.defer();

                // --- Find by Id:
                if ( conds.id ) {
                    that.findById( table, conds.id ).then( function ( res ) {
                        Utils.done( doneFn, Utils.wrapError( null ), Utils.wrapResult( res, res ) );
                    } )
                } else {
                    // --- Find by a property:
                    var _findById = function ( id, callback ) {
                        that.findById( table, id, callback );
                    }
                    var _findById2 = function ( id ) {
                        return that.findById( table, id );
                    }
                    // TODO: Fix this: only support 1 condition for now:
                    for ( var key in conds ) {
                        _client.hscan( [table, '0', 'match', '*:' + key], function ( err, res ) {
                            if ( res && res[1] ) {
                                var arr = res[1],
                                    arrPromises = [];
                                for ( var i = 0; i < arr.length / 2; i++ ) {
                                    if ( arr[ i * 2 + 1 ] === conds[ key ] ) {
                                        var id = arr[i * 2].split( ':' )[0];
                                        arrPromises.push( _findById2(id) );
                                    }
                                }
                                Q.all(arrPromises).then(function( res ) {
                                    if ( res ) {
                                        Utils.done( doneFn, Utils.wrapError( null ), Utils.wrapResult( res, res ) );
                                    }
                                });
                            }
                        } );
                    }
                }
                return ( doneFn && doneFn.promise ? doneFn.promise : {} );
            },
            findOne: function ( table, params, callback ) {
                this.find( table, params, callback );
            },
            findWhere: function ( table, whereClause, params, callback ) {
                return null; // no implementation
            },
            findOneWhere: function ( table, whereClause, params, callback ) {
                return null; // no implementation
            },
            findAll: function ( table, callback ) {
                _client.hgetall( table, function ( err, res ) {
                    if ( callback ) {
                        callback( Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                    }
                } );
            },
            insert: function ( table, obj, callback ) {
                var doneFn = callback || Utils.defer();
                // TODO: Fix this: "obj" must have "id" unique key.
                var id = obj['id'],
                    newObj = {};
                delete obj['id'];
                for ( var key in obj ) {
                    newObj[ id + ':' + key ] = obj[ key ];
                }
                _client.hmset( table, newObj, function ( err, res ) {
                    Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                } );
                return ( doneFn && doneFn.promise ? doneFn.promise : {} );
            },
            update: function ( table, values, conds, callback ) {
                values.id = conds.id;
                return this.insert( table, values, callback );
            },
            count: function ( table, callback ) {
                var doneFn = callback || Utils.defer();
                _client.hkeys( table, function ( err, replies ) {
                    Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( replies, replies.length ) );
                } );
                return ( doneFn && doneFn.promise ? doneFn.promise : {} );
            },
            delete: function ( table, conds, callback ) {
                // TODO: Fix this: only support 1 condition for now:
                var that = this,
                    doneFn = ( callback ? callback : Utils.defer() );
                that.findById( table, conds.id, function ( err, res ) {
                    var arrDelKeys = [], arrPromises = [],
                        keyId = res.id;
                    delete res.id;

                    var _hdel = function ( id ) {
                        var deferred = Q.defer();
                        _client.hdel( table, id, function ( err, delRes ) {
                            deferred.resolve( delRes );
                        } );
                        return deferred.promise;
                    };
                    for ( var key in res ) {
                        arrDelKeys.push( keyId + ':' + key );
                        arrPromises.push( _hdel( keyId + ':' + key ) );
                    }
                    Q.all( arrPromises).then(function( res ) {
                        if ( res ) {
                            Utils.done( doneFn, Utils.wrapError( null ), Utils.wrapResult( res, res ) );
                        }
                    });
                } );
                return ( doneFn && doneFn.promise ? doneFn.promise : {} );
            }
        };
    };

    return MkRedisTextEngine;
} );