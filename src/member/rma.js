


define(function( require, exports, module ) {
	
	/**
	 * 引入包 
	 */
	 var _Ntab = require( 'ntab' );

	 require( 'fancybox' );

	$(function() {

		//tab
		$( ".tabs" ).each( function() {

	    	new _Ntab( this , {
		        currentClass: "current",
		        eventType: "click",
		        handler: "a",
		        index:_index
		    });
	    });

		$('.fb_group').fancybox({
	        'transitionIn'	: 'elastic',
	        'transitionOut'	: 'elastic',
	        'loop'			: true,
	        'titlePosition' : 'over',
	        'titleFormat'   : function(title, currentArray, currentIndex, currentOpts) {
	            return '<span id="fancybox-title-over">Image ' +  (currentIndex + 1) + ' / ' + currentArray.length + ' ' + title + '</span>';
	        }
		});
		$('.fancybox').fancybox({});

            
	});
});