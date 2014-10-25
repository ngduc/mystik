if ( typeof define !== 'function' ) {
    var define = require( 'amdefine' )( module );
}

define( ['./mkUtils.js'], function ( Utils ) {

    var MkRestEngine = function ( apiVer, ajaxFn ) {
        var DEBUG = true;
        var _ver = apiVer,
            _ajax = ajaxFn;

        return {
            request: function ( table, type, urlParams, data, callback ) {
                var tableParams = '';
                for ( var k in urlParams ) {
                    if ( k === '/' ) {
                        tableParams += '/' + urlParams[ k ];
                        delete urlParams[ k ];
                    }
                }

                var url = _ver + '/' + table + tableParams + '?' + $.param( urlParams );
                var ajaxObj = { type: type, url: url, data: JSON.stringify( data ), contentType: 'application/json' };
                if ( ajaxObj.data === '{}' ) {
                    ajaxObj.data = '';
                }
                _ajax( ajaxObj )
                    .done( function ( res ) {
                        if ( callback ) callback( null, Utils.wrapResult( res, res ) );
                    } );
            },
            find: function ( table, urlParams, callback ) {
                this.request( table, 'GET', urlParams, {}, callback );
            },
            findAll: function ( table, callback ) {
                this.request( table, 'GET', {}, {}, callback );
            },
            insert: function ( table, obj, callback ) {
                this.request( table, 'POST', {}, obj, callback );
            },
            update: function ( table, urlParams, params, callback ) {
                this.request( table, 'PUT', urlParams, params, callback );
            },
            delete: function ( table, urlParams, callback ) {
                this.request( table, 'DELETE', urlParams, {}, callback );
            }
        };
    };

    return MkRestEngine;
} );