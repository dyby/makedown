

define(function( require, exports, module ) {
	
	/**
	 * 引入包 
	 */
	 require( 'validate' );

	 $(function(){
	 	$("#add_adv").validate({
	  		messages: {
	  			adv_content: _lang.content_required
	  		}
	  	});
	 });
});