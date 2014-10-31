
// Defines a module that works in CommonJS and AMD: https://github.com/umdjs/umd/blob/master/nodeAdapter.js
if ( typeof module === 'object' && typeof define !== 'function' ) {
    var define = function ( factory ) {
        module.exports = factory( require, exports, module );
    };
}

define( function ( require, exports, module ) {

    // TODO:
    // - handle Error/Exceptions

    var MkTable = function ( engine, table, validator ) {
        var _engine = engine,
            _table = table,
            _validate = validator;

        return {
            find: function ( params, callback, options ) {
                if ( _validate ) {
                    var errObj = _validate.find( params );
                    if ( callback ) callback( errObj, null );
                    return;
                }
                return _engine.find( _table, params, callback, options );
            },
            findOne: function ( params, callback, options ) {
                return _engine.findOne( _table, params, callback, options );
            },
            findWhere: function ( sql, params, callback, options ) {
                return _engine.findWhere( _table, sql, params, callback, options );
            },
            findOneWhere: function ( sql, params, callback, options ) {
                return _engine.findOneWhere( _table, sql, params, callback, options );
            },
            findAll: function ( callback, options ) {
                return _engine.findAll( _table, callback, options );
            },
            insert: function ( obj, callback, options ) {
                return _engine.insert( _table, obj, callback, options );
            },
            update: function ( obj, params, callback, options ) {
                return _engine.update( _table, obj, params, callback, options );
            },
            count: function ( callback, options ) {
                return _engine.count( _table, callback, options );
            },
            delete: function ( params, callback, options ) {
                return _engine.delete( _table, params, callback, options );
            }
        };
    };

    return MkTable;
} );