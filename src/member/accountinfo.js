


define(function( require, exports, module ) {


	/**
	 * 引入包 
	 */
	 require( 'validate' );

	 $(function() {
		
		
	    $("#account_form").validate({
			
	    	messages: {
				'MemberContact[0]': empty_nickname,
				'MemberContact[1]': empty_country,
				'MemberContactJa[0]': empty_nickname,
				'MemberContactJa[1]': empty_country,
				'describes':_describes
			},

			submitHandler: function( form ) {
				
				$( 'input[type=submit]', form ).attr( 'disabled', 'disabled' ).fadeTo( 100, 0.5 );
				
				  form.submit();

			 }
	    });
		
	});

});