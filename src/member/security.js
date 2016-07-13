

define( function( require, exports, module ){
	/**
     * 引入包 
     */
    require( 'validate' );

    $( function(){

    	$("#resetpassword_form").validate({

    		messages: {
				NewUserPass: _lang.Newpass1,
				NewUserPass2: _lang.Newpass2,
				UserPass: _lang.Newpass3
			}

    	});

    });

});