

define( function( require, exports, module ){

	/**
     * 引入包 
     */
    var _Ntab = require( 'ntab' ),
    	_hoverDelay = require( 'hoverDelay' );

    $(function(){
    	//tab
		$( ".tabs" ).each( function() {
	    	new _Ntab( this , {
		        currentClass: "current",
		        eventType: "click",
		        handler: "a",
		        index:0
		    });
	    });

		//hoverDelay

		$( '.pay_info' ).each( function(){
			new _hoverDelay( this, 
				function() {
	               var l = $( this ).position().left - 300, t = $( this ).position().top + 35;
	               var _cinfo=$( this ).attr( "hf" );
	               $( '#copytips span' ).html( _cinfo );
	               $( '#copytips' ).css({ left: l, top: t }).show();
            	},
	            function() {
	              	$( '#copytips' ).hide();
	            });
		});

    });

});