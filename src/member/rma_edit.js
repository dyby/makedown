

define(function( require, exports, module ) {

	/**
	 * 引入包 
	*/
	require( 'fileuploader' );
	require( 'validate' );


	$(function(){

		for( var k in _params.id_arr ) {
			var item = _params.id_arr[ k ];

			uploader({
				msg: {
					sizeError: _lang.sizeError,
					typeError: _lang.typeError
				},
				thumb: true,
				btn_text: _lang.btn_text,
				id: k,
				allowedExtensions:["jpg","jpeg","gif","png","bmp"],
				sizeLimit: 5242800, //2MB 			
				max:4,
				action: _params.action,
				list_id: item.list,
				hidden_name: item.hidden
			});
		}

		$( 'form[name=searchRma]' ).validate({
			submitHandler: function( form ) {
				if( !forDetails() || !uploadRequired() ) {
					return false;
				}
				
				form.submit();
			}
		});
		$.extend( $.validator.messages, {
			required: _lang.content_required
		});
	});

	function forDetails() {
		var l = 0;
		
		if( $( 'textarea.required' ).length < 2 ) {
			return true;
		}
		
		$( 'textarea.required' ).each(function( i ) {
			if( i > 0 ) {
				$( this ).after( this._err = $( '<label class="error" style="display:none;">'+_lang.content_required+'</label>' ) );
				
				if( !$.trim( $( this ).val() ).length ) {
					$( this._err ).show();
					
					l ++;
				}
			}
		});
		
		return l > 0 ? false : true;
	}

	function uploadRequired() {
		var idx = 0, selected = $( 'select[name="data[reason][]"]' ).find( 'option:selected' );
		
		if( !selected.attr( 'uploadstatus' ) ) {
			return true;
		}
		
		$( '.list' ).each(function() {
			
			if( $( this ).find(".qq-upload-list").find( 'li' ).length || $( this ).find(".show_uploader").find("li").length) {
				idx ++;
			} else {
				$(this).find( ".qq-upload-button" ).after( this._err = $( '<label class="error" style="display:none;">'+_lang.content_required+'</label>' ) );
				$(this).find( ".qq-upload-button" ).next('label.error').show();
			}
		});
		// if( idx == 0 ){
		// 	$( ".qq-upload-button" ).after( this._err = $( '<label class="error" style="display:none;">'+_lang.content_required+'</label>' ) );
		// 	$(this._err).show();
		// }else{
		// 	if($(this._err).length){
		// 		$(this._err).hide();
		// 	}
		// }

		return idx == $( '.qq-upload-list' ).length ? true : false;	
	}

});