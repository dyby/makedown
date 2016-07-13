
define(function( require, exports, module ) {
	
	/**
	 * 引入包 
	 */
	require( 'fileuploader' ); 
	require( 'validate' );


	$(function() {


		//fileupload
		uploader({
	        msg: {
	           typeError: _typeError,
	           sizeError: _sizeError
	        },
	        max: 10,
	        id: "file_uploader", 
		    btn_text: _btn_text,
	        allowedExtensions:["jpeg","jpg","gif","png","bmp","txt","doc","docx","pdf","rar"],
	        sizeLimit: 5242880, //2MB       
	        action: _action,
	        list_id: "file_uploader_list",
	        hidden_name: "screenshots[]"
	    }); 

		// validate signup form on keyup and submit
		$("#form_pre").validate({
		    event: "blur",

		    messages: {
		        Content: {
		            required: empty_title
		        }
		    },
		    errorPlacement: function (error, element) { //指定错误信息位置
			      if (element.is('.code_input')) {
			          error.insertAfter(element.next());
			      } else {
			          error.insertAfter(element);
			     }
			 },
			 submitHandler:function() { 
		        	if($("#ordersid").val()=="" || $("#ordersid").val()==null){
						$("#error").show();
						return false;
					}else{
						$("#error").hide();
					}
					$(form).Submit();
		        }

		});
	
	});
	
	
});