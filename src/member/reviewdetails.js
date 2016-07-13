

define(function( require, exports, module ) {
	/**
	 * 引入包 
	 */
	 require( 'fancybox' );


	$('.fb_group').fancybox({
        'transitionIn'	: 'elastic',
        'transitionOut'	: 'elastic',
        'loop'			: true,
        'titlePosition' : 'over',
        'titleFormat'   : function(title, currentArray, currentIndex, currentOpts) {
            return '<span id="fancybox-title-over">Image ' +  (currentIndex + 1) + ' / ' + currentArray.length + ' ' + title + '</span>';
        }
    });

});