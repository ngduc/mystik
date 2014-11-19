
// Defines a module that works in CommonJS and AMD: https://github.com/umdjs/umd/blob/master/nodeAdapter.js
if ( typeof module === 'object' && typeof define !== 'function' ) {
    var define = function ( factory ) {
        module.exports = factory( require, exports, module );
    };
}

define( function ( require, exports, module ) {
    var Utils = require( './mkUtils.js' );

    var MkRestEngine = function ( apiVer, ajaxFn ) {
        var DEBUG = true;
        var _ver = apiVer,
            _ajax = ajaxFn;

        return {
            request: function ( table, type, urlParams, data, callback ) {
                var doneFn = callback || Utils.defer(),
                    tableParams = '';
                for ( var k in urlParams ) {
                    if ( k === '/' ) {
                        tableParams += '/' + urlParams[ k ];
                        delete urlParams[ k ];
                    }
                }

                var url = _ver + '/' + table + tableParams + '?' + $.param( urlParams );
                var ajaxObj = {
                    type: type,
                    url: url,
                    contentType: 'application/json; charset=utf-8'
                };
                if ( data ) {
                    ajaxObj.data = JSON.stringify( data );
                    ajaxObj.dataType = 'json';
                }
                _ajax( ajaxObj )
                    .done( function( res ) {
                        Utils.done( doneFn, null, res );
                    } )
                    .fail( function( xhr, status, error ) {
                        Utils.done( doneFn, xhr.responseText, null );
                    });
                return ( doneFn && doneFn.promise ? doneFn.promise : {} );
            },
            find: function ( table, urlParams, callback ) {
                return this.request( table, 'GET', urlParams, null, callback );
            },
            findAll: function ( table, callback ) {
                return this.request( table, 'GET', {}, null, callback );
            },
            insert: function ( table, obj, callback ) {
                return this.request( table, 'POST', {}, obj, callback );
            },
            update: function ( table, urlParams, params, callback ) {
                // example: Users.update( { '/': userId }, { email: 'test@example.com' } );
                // will send: PUT /userId  { email: 'test@example.com' }
                return this.request( table, 'PUT', urlParams, params, callback );
            },
            delete: function ( table, urlParams, callback ) {
                return this.request( table, 'DELETE', urlParams, null, callback );
            }
        };
    };

    return MkRestEngine;
} );