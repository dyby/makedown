

define(function( require, exports, module ) {
	/**
     * 引入包 
     */

    var _Base = require( 'base' ),
        _Droll = require( 'droll' );


    $(function() {
    
        //大广告
        new _Droll(  $( ".store_album" )[0] , {
            step: 710,
            moveNum: 1,
            dirButton: true,
            loop: true,
            indexButton: false,
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

        
        new _Droll( $( ".goods_box" ) , {

            step: 153, moveNum: 6, index: 0, loop: true,

            onBeforeInView: function( list ) {

                _Base.handLazy( list );
            }
        });
        

    });

});