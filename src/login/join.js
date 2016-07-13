

define( function( require, exports, module ){
	/**
     * 引入包 
     */

    require( 'validate' );
    
    $(function(){
		
       // validate signup form on keyup and submit

       $( "#regForm input" ).focus(function(){

            //$( '#error_login' ).hide();

            if( !$( this ).hasClass("valid") ){
                $( this ).siblings( '.canues' ).removeClass( "canuesshow" ); 
            }

       });
       $( "#regForm input" ).keyup(function(){
            if( !$( this ).hasClass("valid") ){
                $( this ).siblings( '.canues' ).removeClass( "canuesshow" ); 
            }else{
                 $( this ).siblings( '.canues' ).addClass( "canuesshow" ); 
            }
        });

       $("#regForm").validate({
            event: "blur",
            rules:{
                userPass:{
                    minlength: 5
                },
                userPass2: {
                    equalTo: "#userPass",
					minlength: 5
                },
                memberZip:{
                    required:true,
                    milanoo_zip:true
                },
                memberPhone:{
                    required:true,
                    milanoo_phone:true
                }
            },
            messages:{
                'email':{
                    required: noreg_email,
                    email: noreg_email2,
                    minlength: _minlength
                },
                'userPass':{
                    required: nologinpass,
					minlength: _passminlength
                },
                'userPass2':{
                    required: nologinpass,
					minlength: _passminlength,
                    equalTo: noreg_email3
                },
                'conditions':{
                    required: noConditions
                },
                'uName[0]':{
                    required: noMemberContact
                },
                'address[0]':{
                    required: noMemberContactAddr
                },
                'memberState':{
                    required: noMemberUrbanAreas
                },
               'memberCity':{
                    required: noMemberCtiy
                },
                'memberZip':{
                    required: noMemberZip,
                    milanoo_zip: ConsigneeZipInvalidChar
                },
                'memberPhone':{
                    required: noMemberPhone,
                    milanoo_phone: ConsigneePhoneInvalidChar
                },
                'billingUrbanAreas':{
                    required: noMemberUrbanAreas
                }
            },
            success:function( element ){

                element.siblings( '.canues' ).addClass( "canuesshow" );

            },
            errorPlacement: function (error, element) { //指定错误信息位置
                
                if(element.attr( 'name' ) == 'conditions'){
                    error.insertAfter(element.next( 'label' ));
                }else{
                    error.insertAfter(element.next( '.canues' ));
                }  
            }, 
	        submitHandler:function() {
				var _gaq = _gaq || [];
	        	if($('#checkone').is(':checked')){
					_gaq.push(['_trackEvent','Subscription','Submit','Page']);
	        	}
					_gaq.push(['_trackEvent','Reg','Submit','Page']);
				form.submit();
	        }
       });
        //电话号码自定义验证
       jQuery.validator.addMethod("milanoo_phone", function(value, element) {

           if(this.optional(element) || /^[\-\d]+$/.test(value))
            {
                return true;
            }
            else
            {
                  this.settings.messages.billingPhone = ConsigneePhoneInvalidChar;       
            }

            return false;
        }, "error");
        //邮编自定义验证
        jQuery.validator.addMethod("milanoo_zip", function(value, element) {
            if(this.optional(element) || /^[a-zA-Z\d\s]+$/.test(value))
            {
                return true;
            }
            if(value.length<1 || $.trim(value).length==0)
            {
                this.settings.messages.billingZip  = noMemberZip;
            }
            else if(! value.match(/^[a-zA-Z\d\s]+$/) )
            {
                this.settings.messages.billingZip  = ConsigneeZipInvalidChar;
            }
            return false;
        },'error');



    });
});
