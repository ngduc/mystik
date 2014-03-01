if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([], function() {

    // TODO:
    // - handle Error/Exceptions

    var MkTable = function(engine, table, validator) {
        var _engine = engine,
            _table = table,
            _validate = validator;

        return {
            find: function(params, callback) {
                if (_validate) {
                    var errObj = _validate.find(params);
                    if (callback) callback(errObj, null);
                    return;
                }
                return _engine.find(_table, params, callback);
            },
            findOne: function(params, callback) {
                return _engine.findOne(_table, params, callback);
            },
            findWhere: function(sql, params, callback) {
                return _engine.findWhere(_table, sql, params, callback);
            },
            findOneWhere: function(sql, params, callback) {
                return _engine.findOneWhere(_table, sql, params, callback);
            },
            findAll: function(callback) {
                return _engine.findAll(_table, callback);
            },
            insert: function(obj, callback) {
                return _engine.insert(_table, obj, callback);
            },
            update: function(obj, params, callback) {
                return _engine.update(_table, obj, params, callback);
            },
            count: function(callback) {
                return _engine.count(_table, callback);
            },
            delete: function(params, callback) {
                return _engine.delete(_table, params, callback);
            }
        };
    };

    return MkTable;
});