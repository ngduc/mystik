/* jshint -W030 */

// Redis Engine: store data as HashKey - Json string.

// Defines a module that works in CommonJS and AMD: https://github.com/umdjs/umd/blob/master/nodeAdapter.js
if ( typeof module === 'object' && typeof define !== 'function' ) {
    var define = function ( factory ) {
        module.exports = factory( require, exports, module );
    };
}

define( function ( require, exports, module ) {
    var Utils = require( './mkUtils.js' );

    var MkRedisEngine = function (client) {
        var DEBUG = true;
        var _client = client;

        return {
            find: function (table, params, callback) {
                var doneFn = callback || Utils.defer();

                var firstKey = Object.keys(params)[0];
                if ( firstKey === 'id' ) {
                    _client.hget(table, params[ firstKey ], function(err, res) {
                        Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                    });
                }
                return ( doneFn && doneFn.promise ? doneFn.promise : {} );
            },
            findOne: function (table, params, callback) {
                return this.find(table, params, callback);
            },
            findWhere: function (table, whereClause, params, callback) {
                return null; // no implementation
            },
            findOneWhere: function (table, whereClause, params, callback) {
                return null; // no implementation
            },
            findAll: function (table, callback) {
                var doneFn = callback || Utils.defer();
                _client.hgetall(table, function (err, res) {
                    Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                });
                return ( doneFn && doneFn.promise ? doneFn.promise : {} );
            },
            insert: function (table, obj, callback) {
                var doneFn = callback || Utils.defer();
                _client.hset(table, obj[ Object.keys(obj)[0] ], JSON.stringify(obj), function(err, res) {
                    Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                });
                return ( doneFn && doneFn.promise ? doneFn.promise : {} );
            },
            update: function (table, obj, value, callback) {
                var doneFn = callback || Utils.defer();
                _client.hset(table, obj[ Object.keys(obj)[0] ], value, function(err, res) {
                    Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                });
                return ( doneFn && doneFn.promise ? doneFn.promise : {} );
            },
            count: function (table, callback) {
                var doneFn = callback || Utils.defer();
                _client.hkeys(table, function (err, replies) {
                    Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( replies, replies.length ) );
                });
                return ( doneFn && doneFn.promise ? doneFn.promise : {} );
            },
            delete: function (table, params, callback) {
                var doneFn = callback || Utils.defer();
                _client.hdel(table, params[ Object.keys(params)[0] ], function (err, res) {
                    Utils.done( doneFn, Utils.wrapError( err ), Utils.wrapResult( res, res ) );
                });
                return ( doneFn && doneFn.promise ? doneFn.promise : {} );
            }
        };
    };

    return MkRedisEngine;
});