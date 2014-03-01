if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([], function (Utils) {

    var MkRestEngine = function (apiVer, ajaxFn) {
        var DEBUG = true;
        var _ver = apiVer,
            _ajax = ajaxFn;

        return {
            exec: function (table, type, urlParams, data, callback) {
                var url = _ver + '/' + table + '?' + $.param(urlParams);
                _ajax({ type: type, url: url, data: data })
                    .done(function (res) {
                        if (callback) callback(null, res);
                    });
            },
            find: function (table, urlParams, callback) {
                this.exec(table, 'GET', urlParams, {}, callback);
            },
            findAll: function (table, callback) {
                this.exec(table, 'GET', {}, {}, callback);
            },
            insert: function(table, obj, callback) {
                this.exec(table, 'POST', {}, obj, callback);
            },
            update: function (table, urlParams, params, callback) {
                this.exec(table, 'PUT', urlParams, params, callback);
            },
            delete: function(table, urlParams, callback) {
                this.exec(table, 'DELETE', urlParams, {}, callback);
            }
        };
    };

    return MkRestEngine;
});