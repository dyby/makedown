

define(function( require, exports, module ) {
	
	/**
	 * 引入包 
	 */
	 require( 'fancybox' );
	 require( 'validate' );
	 require( 'fileuploader' );

	 var _Ntab = require( 'ntab' ),
	 	_hoverDelay = require( 'hoverDelay' );

	$(function() {

		$( ".fancybox" ).fancybox();

		//tab
		$( ".tabs" ).each( function() {

	    	new _Ntab( this , {
		        currentClass: "current",
		        eventType: "click",
		        handler: "a",
		        index:oq_value
		    });
	    });

		//hoverDelay
		$( '.pay_info' ).each( function(){
			new _hoverDelay( this, 
				function() {
	               var l = $( this ).position().left - 290, t = $( this ).position().top + 30;
	               var _cinfo=$( this ).attr( "hf" );
	               $( '#copytips span' ).html( _cinfo );
	               $( '#copytips' ).css({ left: l, top: t }).show();
            	},
	            function() {
	              	$( '#copytips' ).hide();
	            });
		});
        
		 uploader({
			 msg: {
				typeError: _lang.typeError,
				sizeError: _lang.sizeError
			 },
		     max: 10,
		     id: "file_uploader", 
			 btn_text: _lang.btn_text,
			 allowedExtensions:["jpeg","jpg","gif","png","bmp","txt","doc","docx","pdf","rar"],
			 sizeLimit: 5242880, //2MB 			
		     action: _lang._url,
		     list_id: "file_uploader_list",
		     hidden_name: "myfiles[]"
	    });
		// validate signup form on keyup and submit
		$("#add").validate({
		  messages: {
		    Content: _lang.content_required
		  }
		});
		$("#reply").validate({
		    messages: {
		      reply_Content: _lang.content_required
		    }
	  	});

		$( "#payment_form" ).validate({
	        event: "blur",
	        rules: {
		        WU_mtcn: "required",
		        WU_sender_first_name: "required",
		        WU_sender_middle_name: "required",
				WU_sender_last_name:"required",
				WU_recipient_first_name:"required",
				WU_recipient_last_name:"required",
	        	WU_mtcn: {
	                required: true,
					//digits:true	,
					fun_mtcn:true
	            },
	            WU_sender_first_name: {
	                required: true,
					fun_name:true
	            },
	            WU_sender_middle_name: {
	               // required: true,
					fun_name:true
	            },
				WU_sender_last_name: {
	                required: true,
					fun_name:true
	            },
				WU_recipient_first_name: {
	                required: true,
					fun_name:true
	            },
				WU_recipient_last_name: {
	                required: true,
					fun_name:true
	            }
	        },
	        messages: {
	        	WU_mtcn: {
	                required: _lang.member_mtcn_note,
					fun_mtcn:_lang.member_mtcn_note
	            },
	            WU_sender_first_name: {
	                required: _lang.member_sender_note,
					fun_name:_lang.member_sender_note
	            },
	            WU_sender_middle_name: {
	                //required: "{-$lang.member_sender_middle_note-}",
					fun_name:_lang.member_sender_note
	            },
				WU_sender_last_name: {
	                required: _lang.member_sender_note,
					fun_name: _lang.member_sender_note
	            },
				WU_recipient_first_name: {
	                required: _lang.member_sender_note,
					fun_name:_lang.member_sender_note
	            },
				WU_recipient_last_name: {
	                required: _lang.member_sender_note,
					fun_name: _lang.member_sender_note
	            }
	        }  
	    });
		
		jQuery.validator.addMethod('fun_mtcn',function(value, element,params){
			var expN = /^[0-9]+$/;
			var length=value.length;
			return this.optional(element)||(length == 10 && expN.test(value));
		},"");
	  
	    jQuery.validator.addMethod('fun_name',function(value, element,params){
			var exp = /^[a-zA-Z\s]+$/;
			//var length=value.length;
			return this.optional(element)||(exp.test(value));
		},"");

	});
});