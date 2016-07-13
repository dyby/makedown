

define(function( require, exports, module ) {
	/**
     * 引入包 
     */

    var _Base = require( 'base' ),
        _Event = require( 'event' ),
        _Droll = require( 'droll' );

    require( 'extAPI' );

    $(function() {
    
        //大广告
        new _Droll(  $( ".slide_album" )[0] , {
            step: 750,
            moveNum: 1,
            dirButton: true,
            loop: true,
            indexButton: true,
            auto: true,
            outerSelector: "div.my_inslide",
            itemsSelector: "div",
            onBeforeInView: function( list ) {
                
                $( list ).each(function() {
                    var _image = $( this ).find( 'img' ), o = _image.attr( 'src1' ) || _image.attr( 'original' ), s = _image.attr( 'src' );
                    
                    if( o && o != '' ) {
                        _image.attr( 'src', o ).removeAttr( 'src1' ).removeAttr( 'original' );
                    }
                });
            }
        });

        //鼠标移动到滚动图上展示左右箭头
        new _Event.transit( $( '.slide_album' )[0], {

            onOver: function( target ) {
                $( target ).find( '.pdo-droll_dirbutton a' ).animate({ 
                    "width":"40px" 
                }, 100 );
            },
            onOut: function( target ) {
                $( target ).find( '.pdo-droll_dirbutton a' ).animate({ 
                    "width":"0" 
                }, 100 );
            }

        });

        extAPI.SNS.facebook();

    });

});