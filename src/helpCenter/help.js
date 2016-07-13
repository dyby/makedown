
define( function( require, exports, module ){
	/**
     * 引入包 
     */

    var _Ntab = require( 'ntab' );
    $( function(){
        //用于判断url地址默认指向哪个tab啦
        var openTarget = window.location.hash.replace('#', '').split('?')[0], _index = 0;
        if( openTarget == "contactUs" ){
           _index = 1;
        }
        $( ".tabs" ).each( function() {

        	new _Ntab( this , {
    	        currentClass: "current",
    	        eventType: "click",
    	        handler: "a",
    	        index:_index
    	        /*,
    	        onShow:function(){

    	          $( ".pack_up" ).show();

    	        }*/
    	    });
        });
    });
});
