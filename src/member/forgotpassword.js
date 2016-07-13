
define(function( require, exports, module ) {
	
	/**
	 * 引入包 
	*/

	require( 'validate' );

	$(function(){
	
		var check_email = 0;
		$("#email").blur(function(){
			var mail = $('#email').val();
			var data = 'name='+mail;
			if(mail==""){
				return false;
			}
			$.ajax({
				cache:"false",
				url:root_url+"index.php?module=ajax&action=reg",
				type: "post", 
				data:data,
				success:function(datas){
					if(datas != 3){
						$('#mail_errors').show();
						check_email = 0
					}else{
						$('#mail_errors').hide();
						check_email = 1;
					}
				}
			});
		});
	
	
		// validate signup form on keyup and submit
	    $("#join_submit").validate({
	        messages: {
	        	email: {
	                required: _lang.nologinname                   
	            },
	            verifycode: {
	                required: _lang.RegcodePrint
	            }
	        },
			errorPlacement: function (error, element) { //指定错误信息位置
                if( element.attr( 'name' ) =="verifycode" ){
					 error.insertAfter(element.next( 'a' ));
				}else{
					error.insertAfter(element);
				} 
            },
			submitHandler:function(form){
				if(check_email==1){
					form.submit();
				}else{
					return false;
				}
			}
	    });
		
		
	});

});