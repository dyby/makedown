

define(function( require, exports, module ) {
	
	/**
	 * 引入包 
	 */
	 var _Ntab = require( 'ntab' ),
	 	_Droll = require( 'droll' ),
	 	_Jchecked = require( 'jchecked' ),
	 	_Base = require( 'base' );


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

		//jchecked

		$('.jchecked').each(function(){

			new _Jchecked(this,{

				callfunc:function( ) {

					$('#select_all').change(function(){

						var _status = $(this).is( ':checked' ) ;

						if( _status ){

							$('.wl').prop('checked',true).trigger( 'change' ) ;

						}else{
							 $('.wl').prop('checked',false).trigger( 'change' ) ;

						}
						
					});
				}
			});
		});
            
	});
});