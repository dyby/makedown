
define(function( require, exports, module ) {
	
	/**
	 * 引入包 
	 */
	 var _Moreview = require( 'moreview' ),
	 	_SimpleTree = require( 'simpleTree' );

	$(function() {

		//jselect

		//$( ".goods_item" ).each(function(){

		new _Moreview( $( ".goods_item" ) , {onNode: "dt > a"} );

		//});
	
		$( '.list_left > dl' ).each(function(){
			new _SimpleTree( this , {
				handler : ">dt",
				toggleClass : "plus",
				showtarget : "dd"
			});
		});

	});
	
	
});