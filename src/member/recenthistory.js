

define(function( require, exports, module ) {
	
	/**
	 * 引入包 
	 */
	 var _Ntab = require( 'ntab' ),
	 	_Base = require( 'base' ),
	 	_Droll = require( 'droll' );

	$(function() {
		//tab
		$( ".tabs" ).each( function() {

	    	new _Ntab( this , {
		        currentClass: "current",
		        eventType: "click",
		        handler: "a",
		        index:0
		    });
	    });
		//Droll
		$( ".tabs_box" ).each( function(){
			new _Droll( this, {
                step: 155,
                moveNum: 4,
                index: 0,
                loop: true,
                onBeforeInView: function( list ) {
					_Base.handLazy( list );
				}
            });
		});

		    
	});
});