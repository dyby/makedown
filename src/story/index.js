

define( function( require, exports, module ){
	/**
     * 引入包 
     */
     require( 'gmasonry' );

     var _GetAddthis = require( 'getAddthis' );

     $( window ).load(function() {
        // sns
        new _GetAddthis( $( '.epaddthis' ) );
    });

     $(function(){

        var container = $('.masonry');//瀑布流
        container.imagesLoaded(function(){
          container.masonry({
            itemSelector : 'dl'
          });
        });

     });
    
});
