

define(function( require, exports, module ) {
	/**
	 * 引入包 
	 */
	 require( 'fileuploader' );
	 require( 'validate' );

	 var _Star = require( 'star' );


	$(function(){

		$( '.starMod' ).each(function(){
			new _Star( this );
		});

	 	uploader({
			msg: {
				sizeError: _lang._sizeError,
				typeError: _lang._typeError
			},
			edit: true,
			thumb: true,
			btn_text: _lang._btn_text,
			id: "file_uploader_1",
			allowedExtensions:["jpg","jpeg","gif","png","bmp"],
            sizeLimit: 5242880, //2MB 			
			max:4,
			action: _lang._action,
			list_id: "file_uploader_list",
			hidden_name: "myfiles[]"
		});

 		$("#comment_one").validate({
			messages: {
				Uname: _lang.uname_required,
				Uemail: _lang.nologinname,
				Ucontent: _lang.content_required,
				VCode:_lang.RegcodePrint
			},
			submitHandler: function( form ) {
				var msg=_lang.uname_required;
				var v_input = $( form ).find( 'input[name=videoUrl]' );
				if($(".starnum1").val()=="0"){
					$( form ).find(".bigStar_item").next().html("<label class='error'>"+msg+"</label>");
					return false;
				}
				
				if( v_input.val() !== "" && v_input.length ) {
					var val = $.trim( v_input.val() );
					
					if( !/youtu\.be|youtube\.com/.test( val ) || !/^http:\/\/|^https:\/\//i.test( val ) ) {
						alert( _lang.member_PYYTB );
						return false;
					}
				}
				
				else{
					from.submit();
				}
			},
			errorPlacement: function (error, element) { //指定错误信息位置
                
                if(element.attr( 'name' ) == 'VCode'){
                    error.insertAfter(element.next( '.vcode' ));
                }else{
                    error.insertAfter(element);
                }  
            }
		});


	});


});