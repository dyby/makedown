
define( function( require, exports, module ){
	/**
     * 引入包 
     */

    var _Ntab = require( 'ntab' );
    
    $( function(){
	    $( ".tabs" ).each( function() {

	    	new _Ntab( this , {
		        currentClass: "current",
		        eventType: "click",
		        handler: "a",
		        index:2
		        /*,
		        onShow:function(){

		          $( ".pack_up" ).show();

		        }*/
		    });
	    });
    });
});
