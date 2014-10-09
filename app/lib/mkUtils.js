/* jshint -W030 */
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([], function() {

    // Polyfill for Object.keys
    Object.keys=Object.keys||function(o,k,r){r=[];for(k in o)r.hasOwnProperty.call(o,k)&&r.push(k);return r;};

    // mongo2sql, source: https://gist.github.com/jankuca/761760
    // DUC NGUYEN updated 02/2014
    var DEBUG = true;

    var json2sql = {};

    /**
     * Separator of a namespace and a keyname within each level (ns-SEP-keyname)
     * For instance if the separator were set to "__" the column name for a field
     * named "address:city" in the code would be "address__city".
     * @type {string}
     */
    json2sql.NAMESPACE_SEPARATOR = '__';

    /**
     * Separator of levels (level-SEP-level)
     * For instance if the separator were set to "___" the column name
     * for a structure named "parent.address:city" in the code would be
     * "parent___address__city".
     * @type {string}
     */
    json2sql.LEVEL_SEPARATOR = '___';

    /**
     * Regular expression for matching valid column names
     * If an invalid column name results from the input keys, an Error is thrown.
     * @type {RegExp}
     */
    json2sql.VALID_COLUMN_NAME = /^\w+$/;

    /**
     * Returns a string that can be used as a WHERE clause in SQL queries and its
     *   parameters. The string features "?" instead of each parameter to prevent
     *   SQL injection by letting the native codebase handle the substitution.
     * @param {!Object} selector
     * @param {string=} prefix Key prefix
     *   Used mostly internally for nested selectors
     * @return {{sql: string, params: Array}}
     */
    json2sql.stringify = function (selector, prefix) {
        prefix = prefix ? prefix + json2sql.LEVEL_SEPARATOR : '';

        var chunks = [];
        var params = [];

        Object.keys(selector).forEach(function (key) {
            var value = selector[key];

            if (key.charAt(0) !== '$') {
                key = key.replace(/:/g, json2sql.NAMESPACE_SEPARATOR);
                key = key.replace(/\./g, json2sql.LEVEL_SEPARATOR);
                key = prefix + key;
                if (!json2sql.VALID_COLUMN_NAME.test(key)) {
                    throw new Error('Invalid column name ' + key);
                }

                if (typeof value !== 'object') {
                    //...chunks.push('AND [' + key + '] = ?');
                    chunks.push('AND ' + key + ' = ?');
                    params.push(value);
                } else {
                    Object.keys(value).forEach(function (sub_key) {
                        var sub_value = value[sub_key];
                        var sub;
                        if (sub_key.charAt(0) !== '$') {
                            sub_key = key + json2sql.LEVEL_SEPARATOR + sub_key;
                            // { key: value = { sub_key: sub_value }}
                            if (typeof sub_value === 'object') {
                                sub = json2sql.stringify(value, key);
                                chunks.push('AND', sub.sql);
                                params = params.concat(sub.params);
                            } else {
                                //...chunks.push('AND [' + sub_key + '] = ?');
                                chunks.push('AND ' + sub_key + ' = ?');
                                params.push(sub_value);
                            }
                        } else {
                            // { key: value = { $modifier: value }}
                            sub = json2sql.stringifyModifier_(key, sub_key.substr(1), sub_value);
                            chunks.push('AND', sub.sql);
                            params = params.concat(sub.params);
                        }
                    });
                }
            } else {
                var modifier = key.substr(1);
                switch (modifier) {
                    case 'or':
                        // { $or: value = [ selector, selector ]}
                        chunks.push('AND (');
                        value.forEach(function (option, i) {
                            var sub = json2sql.stringify(option, prefix);
                            if (i) {
                                chunks.push('OR');
                            }
                            chunks.push('(', sub.sql, ')');
                            params = params.concat(sub.params);
                        });
                        chunks.push(')');
                        break;
                    default:
                        throw new Error('Invalid modifier $' + modifier);
                }
            }
        });

        return {
            sql: chunks.join(' ').substr(4),
            params: params
        };
    };

    /**
     * Returns a part of a WHERE clause
     * @param {string} key The name of the column
     * @param {string} modifier The modifier to apply
     * @return {{sql: string, params: Array}}
     */
    json2sql.stringifyModifier_ = function (key, modifier, value) {
        //...var chunks = [ '[' + key + ']' ];
        var chunks = [ key ];
        var params = [];
        var qmarks = [];

        switch (modifier) {
            case 'gt':
                chunks.push('>', '?');
                params.push(value);
                break;
            case 'gte':
                chunks.push('>=', '?');
                params.push(value);
                break;
            case 'lt':
                chunks.push('<', '?');
                params.push(value);
                break;
            case 'lte':
                chunks.push('<=', '?');
                params.push(value);
                break;
            case 'ne':
                chunks.push('!=', '?');
                params.push(value);
                break;
            case 'in':
                if (!value.length) {
                    throw 'Invalid state: No items for the IN operator';
                }
                qmarks = [];
                for (var i in value) qmarks.push('?');
                chunks.push('IN (', qmarks.join(', '), ')');
                params = params.concat(value);
                break;
            case 'nin':
                //... this causes 'undefined' error:
                /*if (!value[modifier].length) {
                    throw 'Invalid state: No items for the NOT IN operator';
                }*/
                qmarks = [];
                for (var j in value) qmarks.push('?');
                chunks.push('NOT IN (', qmarks.join(', '), ')');
                params = params.concat(value);
                break;
            case 'exists':
                chunks.push('IS', value ? 'NOT NULL' : 'NULL');
                break;
            case 'or':
                // { key: { $or: value = [ selector, selector ]}}
                chunks.push('AND (');
                value.forEach(function (option, i) {
                    var sub = json2sql.stringify(option, key);
                    if (i) {
                        chunks.push('OR');
                    }
                    chunks.push('(', sub.sql, ')');
                    params = params.concat(sub.params);
                });
                chunks.push(')');
                break;
            default:
                throw new Error('Invalid modifier $' + modifier);
        }

        return {
            sql: chunks.join(' '),
            params: params
        };
    };

    return {
        json2sql: json2sql,

        defer: function() {
            var Q = require('q');
            return Q.defer();
        },

        done: function( deferOrCallback, err, res ) {
            if ( ! deferOrCallback ) {
                return;
            }

            if ( typeof deferOrCallback === 'function' ) {
                deferOrCallback( err, res );
            } else {
                if ( err == null || err.error == null ) {
                    deferOrCallback.resolve( res );
                } else {
                    deferOrCallback.reject( new Error( err ) );
                }
            }
        },

        execScripts: function(dbClient, sqlArray, callback) {
            var async = require('async');
            var fn = function(item, ret) {
                dbClient.execute(item, [],
                    function(err, result) {
                        if (err) {
                            DEBUG && console.log('ERROR:', err);
                        } else {
                            DEBUG && console.log('DONE:', item);
                            ret(null);
                        }
                    }
                );
            };
            async.eachSeries(sqlArray, fn, function() {
                callback();
            });
        },

        wrapError: function (err) {
            var wrappedErr;
            if (err !== null) {
                wrappedErr = {
                    'code': -1,
                    'message': '',
                    'error': err
                };
            } else {
                wrappedErr = {
                    'code': 0,
                    'message': '',
                    'error': null
                };
            }
            return wrappedErr;
        },

        wrapResult: function(res, result) {
            var wrappedRes = {
                'timestamp': Date.now().toString(),
                'result': null
            };
            if (res !== null) {
                wrappedRes.result = result;
            }
            return wrappedRes;
        }
    };
});