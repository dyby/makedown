

define( function( require, exports, module ){
	/*
     * 引入包 
     *
     */

    require( 'validate' );

    var _Form = require( 'ui.form' );
	var _login_time="1";
    
    //验证
    $(function(){
       // validate signup form on keyup and submit
       $( "#login_submit input" ).focus(function(){

            $( '#error_login' ).hide(); 

            if( !$( this ).hasClass("valid") ){
                $( this ).siblings( '.canues' ).removeClass( "canuesshow" ); 
            }

       });
       $( "#login_submit input" ).keyup(function(){
            if( !$( this ).hasClass("valid") ){
                $( this ).siblings( '.canues' ).removeClass( "canuesshow" ); 
            }else{
                 $( this ).siblings( '.canues' ).addClass( "canuesshow" ); 
            }
        });

        $( "#login_submit" ).validate({
            event: "blur",
            messages: {
                loginusername: {
                    required: nologinname,
                    email:   noemail                
                },
                loginuserpass: {
                    required: nologinpass
                },
                verifycode: {
                    required: RegcodePrint
                }
            },
            success:function( element ){

                element.siblings( '.canues' ).addClass( "canuesshow" );

            },
            errorPlacement: function (error, element) { //指定错误信息位置
                if( element.attr( 'name' ) =="verifycode" ){
					 error.insertBefore(element.next( 'a' ));
				}else{
				     error.insertAfter(element.next( '.canues' ));
				}  
            }, 
            submitHandler:function( form ){
                
                var loginusername = $( "#loginusername" ).val(),
                    loginuserpass = $( "#loginuserpass" ).val(),
                    verifycode = $( "#verifycode" ).val();
                    isverifycode = $( "#isverifycode" ).val();					

                _Form.submit.lock( $( form ).find( 'button[type="submit"]' )[0], _lang.loading );

               $.ajax({         
                    type: 'POST',
                    url : _url,
                    data: "loginusername="+loginusername+"&loginuserpass="+loginuserpass+"&isverifycode="+isverifycode+"&verifycode="+verifycode+"&forward="+forward,
                    dataType:'json',
                    success: function( data ) {
                        if(data.error_status == 0){
                            window.location.href = data.forward;
                            return true;                        
                        }else{
							var act='reg';
                            $( '#error_login' ).html( data.msg);
                            $( '#error_login' ).show();
							$('#vfcode'+act).attr('src',_root_url+'auth/captcha/?act='+ act + '&' + Math.random());
							
							if(_login_time>4){
								$('#isverifycode').attr('value',"yes");
								$( '#verify' ).show();
							}
							_login_time++;

                            _Form.submit.unlock( $( form ).find( 'button[type="submit"]' )[0] );

                            return false;
                        }
                    }
                });
            }
        });


        $( ".login_right" ).validate({
            messages:{
                getEmail: {
                    required: nologinname,
                    email:   noemail,
                    minlength:   _minlength             
                }
            },
            submitHandler: function( form ) {
                
                _Form.submit.lock( $( form ).find( 'button[type="submit"]' )[0], _lang.loading );				
				form.submit();
            }
        });

    });
});
