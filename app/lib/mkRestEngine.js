if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([], function(Utils) {

    var MkRestEngine = function(apiVer, ajaxFn) {
        var DEBUG = true;
        var _ver = apiVer,
            _ajax = ajaxFn;

        return {
            exec: function(table, type, params, callback) {
                var url = _ver + '/' + table + '?' + $.param(params);
                _ajax({ type: type, url: url, data: {} })
                    .done(function(res) {
                        if (callback) callback(null, res);
                    });
            },
            find: function(table, params, callback) {
                this.exec(table, 'GET', params, callback);
            },
            findAll: function(table, callback) {
                this.exec(table, 'GET', {}, callback);
            }
        }
    }

    return MkRestEngine;
})