/* jshint -W030 */
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['./mkUtils'], function (Utils) {
    // DB client: https://github.com/jorgebay/node-cassandra-cql

    var MkRedisEngine = function (client) {
        var DEBUG = true;
        var _client = client;

        return {
            find: function (table, params, callback) {
                _client.hget(table, params[ Object.keys(params)[0] ], function(err, res) {
                    if (callback) {
                        callback(Utils.wrapError(err), Utils.wrapResult(res, res));
                    }
                });
            },
            findOne: function (table, params, callback) {
                this.find(table, params, callback);
            },
            findWhere: function (table, whereClause, params, callback) {
                return null; // no implementation
            },
            findOneWhere: function (table, whereClause, params, callback) {
                return null; // no implementation
            },
            findAll: function (table, callback) {
                // find all keys
                _client.hkeys(table, function (err, res) {
                    if (callback) {
                        callback(Utils.wrapError(err), Utils.wrapResult(res, res));
                    }
                });
            },
            insert: function (table, obj, callback) {
                _client.hset(table, obj[ Object.keys(obj)[0] ], JSON.stringify(obj), function(err, res) {
                    if (callback) {
                        callback(Utils.wrapError(err), Utils.wrapResult(res, res));
                    }
                });
            },
            update: function (table, obj, value, callback) {
                _client.hset(table, obj[ Object.keys(obj)[0] ], value, function(err, res) {
                    if (callback) {
                        callback(Utils.wrapError(err), Utils.wrapResult(res, res));
                    }
                });
            },
            count: function (table, callback) {
                _client.hkeys(table, function (err, replies) {
                    if (callback) {
                        callback(Utils.wrapError(err), Utils.wrapResult(replies, replies.length));
                    }
                });
            },
            delete: function (table, params, callback) {
                _client.hdel(table, params[ Object.keys(params)[0] ], function (err, res) {
                    if (callback) {
                        callback(Utils.wrapError(err), Utils.wrapResult(res, res));
                    }
                });
            }
        };
    };

    return MkRedisEngine;
});