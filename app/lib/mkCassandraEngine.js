/* jshint -W030 */
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['./mkUtils'], function (Utils) {
    // DB client: https://github.com/jorgebay/node-cassandra-cql

    var MkCassandraEngine = function (client) {
        var DEBUG = true;
        var _client = client;

        // customize Utils.wrapError for CassandraEngine:
        function _wrapError(err) {
            var e = Utils.wrapError(err);
            if (typeof e.error !== 'undefined' && e.error &&
                typeof e.error.name !== 'undefined') {
                e.message = e.error.name;
            }
            return e;
        }

        return {
            exec: function (table, sql, params, callback) {
                _client.execute(sql, params,
                    function (err, res) {
                        if (err) {
                            DEBUG && console.log('ERROR:', err);
                            if (callback) callback(err, res);
                        } else {
                            DEBUG && console.log('DONE:', sql); /* jshint -W030 */
                            if (callback) callback(err, res);
                        }
                    }
                );
            },
            find: function (table, params, callback) {
                var p = Utils.json2sql.stringify( params );
                var sql = 'SELECT * FROM "' + table + '" WHERE ' + p.sql;
                this.exec(table, sql, p.params, function (err, res) {
                    if (callback) {
                        callback(_wrapError(err), Utils.wrapResult(res, (err ? null : res.rows) ));
                    }
                });
            },
            findOne: function (table, params, callback) {
                var p = Utils.json2sql.stringify( params );
                var sql = 'SELECT * FROM "' + table + '" WHERE ' + p.sql + ' LIMIT 1';
                this.exec(table, sql, p.params, function (err, res) {
                    var one = null;
                    if (typeof res !== 'undefined' &&
                        typeof res.rows !== 'undefined' &&
                        typeof res.rows[0] !== 'undefined') {
                        one = res.rows[0];
                    }
                    if (callback) {
                        callback(_wrapError(err), Utils.wrapResult(res, one));
                    }
                });
            },
            findWhere: function (table, whereClause, params, callback) {
                if (whereClause.length > 0) {
                    whereClause = ' WHERE ' + whereClause;
                }
                var sql = 'SELECT * FROM "' + table + '" ' + whereClause;
                this.exec(table, sql, params, function (err, res) {
                    if (callback) {
                        callback(_wrapError(err), Utils.wrapResult(res, res.rows));
                    }
                });
            },
            findOneWhere: function (table, whereClause, params, callback) {
                var sql = 'SELECT * FROM "' + table + '" WHERE ' + whereClause + ' LIMIT 1';
                this.exec(table, sql, params, function (err, res) {
                    var one = null;
                    if (typeof res !== 'undefined' &&
                        typeof res.rows[0] !== 'undefined') {
                        one = res.rows[0];
                    }
                    if (callback) {
                        callback(_wrapError(err), Utils.wrapResult(res, one));
                    }
                });
            },
            findAll: function (table, callback) {
                this.findWhere(table, '', [], callback);
            },
            insert: function (table, obj, callback) {
                var cols = [], qmarks = [], vals = [];
                for (var i in obj) {
                    cols.push('"' + i + '"');
                    vals.push(obj[i]);
                    qmarks.push('?');
                }
                var sql = ['INSERT INTO "', table, '"(', cols.join(), ') VALUES(', qmarks.join(), ');'].join('');

                this.exec(table, sql, vals, function(err, res) {
                    if (callback) {
                        callback(_wrapError(err), Utils.wrapResult(res, res));
                    }
                });
            },
            update: function (table, obj, params, callback) {
                var p = Utils.json2sql.stringify( params );
                var cols = '', vals = [];
                for (var i in obj) {
                    cols += '"' + i + '"=?, ';
                    vals.push(obj[i]);
                }
                cols = cols.substr(0, cols.length - 2); // remove last comma.
                var sql = 'UPDATE "' + table + '" SET ' + cols + ' WHERE ' + p.sql;

                var arr = vals.concat(p.params); // merge
                this.exec(table, sql, arr, function (err, res) {
                    if (callback) callback(err, res);
                });
            },
            count: function (table, callback) {
                var sql = 'SELECT COUNT(*) FROM "' + table + '"';

                this.exec(table, sql, [], function (err, res) {
                    if (callback) {
                        callback(_wrapError(err), Utils.wrapResult(res, res.rows[0].count.low));
                    }
                });
            },
            delete: function (table, params, callback) {
                var obj = Utils.json2sql.stringify( params );
                var sql = 'DELETE FROM "' + table + '" WHERE ' + obj.sql;

                this.exec(table, sql, obj.params, callback);
            }
        };
    };

    return MkCassandraEngine;
});