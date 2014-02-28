if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([], function(Utils) {

    var MkRestEngine = function(ajaxFn) {
        var DEBUG = true;
        var _ajax = ajaxFn;

        return {
            findAll: function(table, callback) {
                var url = '/' + table + '/findAll';
                _ajax({
                    type: 'GET',
                    url: url,
                    data: {}
                }).done(function(res) {
                    if (callback) callback(null, res);
                });
            }
        }
    }

    return MkRestEngine;
})