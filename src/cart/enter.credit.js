
define(function( require, exports, module ){
		
    require( 'validate' );
    require( 'fancybox' );
    
    $(function() {



		$.extend($.validator.messages, {
			required: _lang.required
		});
		
		$("#credit_pay").validate({
			errorPlacement: function( error, elem ) {
				$( elem ).parent().append( error );
			},
			submitHandler: function( form ) {
				form.submit();
			}
		});

		$( '.fancybox' ).fancybox();

		$( '.s_card_choose' ).change(function() {

			if( $( '#s_cardinfo' ).is( ':hidden' ) ) {
				$( '#s_cardinfo' ).show();

				$( '#s_pay' ).removeClass( 'disabled' ).removeAttr( 'disabled' );
			}

			if( $( this ).val() == 5 ) {
				$( '.required_tips' ).hide();
				$( '.cvc_required' ).removeClass( 'required' );
				$( '.cvc_required' ).parent().find( 'label.error' ).hide();
			} else {
				$( '.required_tips' ).show();
				$( '.cvc_required' ).addClass( 'required' );
			}

		});

    });
	
	
});
