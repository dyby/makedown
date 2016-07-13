

define( function( require, exports, module ){
	/**
     * 引入包 
     */
    require( 'validate' );
$(function() {
    // validate signup form on keyup and submit
	$("#form_pre").validate({
	    event: "blur",

	    messages: {
          desc:{
              required: empty_title    
          },
          desc1:{
            required: empty_title
          },
	    	  owner_name: {
	            required: empty_title             
	        },
	        legal_name: {
	            required: empty_title
	        },
          phone: {
              required: empty_title,
			  number:ConsigneePhoneInvalidChar
          },
          fax: {
              required: empty_title,
			  number:ConsigneeZipInvalidChar
          },
          mail_addresss: {
              required: empty_title,
              email:  email1
          },
          street:{
            required: empty_title
          },
          checkcode:{
             required: empty_title
          },
          title:{
             required: empty_title
          }

	    },
	    errorPlacement: function (error, element) { //指定错误信息位置
		      if (element.is('.code_input')) {
		          error.insertAfter(element.next());
		      } else {
		          error.insertAfter(element);
		     }
		 }

	});
});
    
});