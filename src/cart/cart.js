

define(function( require, exports, module ){
	/**
     * 引入包 
     */
	var _Main = require( 'cart/main' ),
		_Price = require( 'price' ),
		_Form = require( 'ui.form' ),
		_Jselect = require( 'jselect' );
		
    require( 'validate' );
    
	/**
	 * 加载 fancybox 插件
	 */
	require( 'fancybox' );
    
    $(function() {

    	// 总价始终保持在可视区域
    	_Main.elemFixed( '.s_fixed_place', '.content' );
		
		_Main.shipInfo( $( '#countryShipping' ).find( 'option:selected' ).val() );

		_Form.validateNumber();
		
		// 计算运费价格等
    	$( '.logistics_radio, #paymethod, #worldPay_country' ).change(function() {
    		_Main.cart.update();
	   		_Main.cart.checkSubmit();
    	});

    	// 更新运费
    	$( '.logistics_radio' ).change(function() {
    		var st = _Main.cart.shipType();

    		$( '.s_ship_off' ).html( st.off );
    		_Price.update( $( '.s_ship_sale' ), st.sale );
    		_Price.update( $( '.s_ship_old' ), st.old );
	    });

    	// 运费保险
	    $( '#insurance' ).change(function() {
	    	var st = _Main.cart.shipType();

    		$( '.s_ship_off' ).html( st.off );
    		_Price.update( $( '.s_ship_sale' ), st.sale );
    		_Price.update( $( '.s_ship_old' ), st.old );

    		_Main.cart.update();
	    });

	    _Main.cart.checkSubmit();

	    
	    $( '#form' ).submit(function() {
	    	_Form.submit.lock( $( '#s_proceed_pay' ), _msg.loading );	
	    })
		// END


		$( '#check_confirm' ).change(function() {
			$( '#confirm_layout' )[ $( this ).is( ':checked' ) ? 'fadeIn' : 'fadeOut' ]( 100 );
		});


	   	$( '.s_jselect' ).each( function() {
            new _Jselect( this );
        });

		$( '.fancybox' ).fancybox();


		// 使用折扣券
		$( '#libkey_btn' ).click(function() {
			_Main.shopCode( $( '#libkey' ).val() );
		});
		
		$( '#libkey' ).keyup(function( event ) {
			if( event.keyCode == 13 ) {
				_Main.shopCode( $( '#libkey' ).val() );
			}
		});

		$( '.couponData' ).change(function() {
			$( '#libkey' ).val( $( this ).val() ).focus();
		});



		$( '.s_shopcode' ).live('click',function() {
			var t = $( this ).attr( 'type' );

			_Main.shopCode( $( '#libkey' ).val(), t );
		});

		// 取消折扣券
		$( '.s_cancel_shopcode' ).live('click',function() {
			_Main.cancelCoupon();
		});
		
		

		$('#learn_about_time').click(function(){
			$('#slideText').slideToggle('fast');
		});
/*
		$('.radioWrapper input,.checkedWrapper label').each( function(){
				
			var $this = $(this) , def_checkbox = $this.attr('checked') ;

			if( typeof (def_checkbox) !== "undefined" &&  def_checkbox !== ""){
			
				var def_checked = def_checkbox == 'checked' ? true : false ;				

				if( def_checked  ){				
					$this.parent().find('label').addClass('checkedEnd');
				}

			}
		});
		
		$('.radioWrapper label').bind('click',function(){
			$(this).parent().parent().find('input').attr('checkbox','');
			$(this).parent().parent().find('label').removeClass('checkedEnd');
			$(this).parent().find('input').attr('checkbox','checked');
			$(this).addClass('checkedEnd');
			
		});
		
		$('.checkedWrapper label').bind('click',function(){
			if( $(this).hasClass('checkedEnd') ){
				$(this).removeClass('checkedEnd');
				$(this).parent().find('input').attr('checkbox','');
			}else{
				$(this).addClass('checkedEnd');
				$(this).parent().find('input').attr('checkbox','checked');
			}
		});*/
		
		$('#paymethod').change(function(){
			var pay = $('#paymethod').val();
			$(".payinfo").hide();
			$("#pay_"+pay).show();
		});
		
		$( '.s_edit_address' ).click(function() {
			
			var aid = $( this ).attr( 'aid' );
			
			_Main.editAddress( aid );
		});
		$( '.s_paypal_address' ).click(function() {
			
		});
		
		$( '#new_address_btn' ).click(function() {
			_Main.newAddress();
		});
		
		$( '.shipping_address' ).click(function() {
			var address_id = $( this ).val();
			//console.log( address_id )
			window.location.href = _params.url + "?act=editlogistic&addressid="+address_id;
		})
		
		$( '.logistics_radio' ).click(function() {
			var posttime = $( this ).attr('posttime');
			$( '#time_show_middle_shipptime' ).html( posttime );
		})
		
		$( '#consigneeStateId' ).change(function() {
			
			var countrPhone = '+' + $( '#consigneeStateId option:selected' ).attr( 'phone' );
			
			var state = $( '#consigneeStateId option:selected' ).val();
			
			$( '#country_code_field' ).attr('value',countrPhone);
			
			if(state == 85){
				$( '#nsend' ).html(_msg.thing_ShippingNo);	
				
				$( '#nsend' ).css('color','red')	
			}else{
				$( '#nsend' ).html("");
			}
		});
		
		$("#addressForm").validate({
			event: "blur",
			rules: {
				consigneePostalcode:{
					required:true,
					milanoo_zip:true
				},
				consigneePhone:{
					required:true,
					milanoo_phone:true
				}
			},
			messages: {
				'consigneeName[0]': {
					required:_msg.noMemberContact
				},
				'consigneeName[1]': {
					required:_msg.noMemberContact
				},
				'consigneeAddr[0]':{
					required:_msg.noMemberContactAddr
				},
				'consigneeCity':{
					required:_msg.noMemberCtiy
				},
				'MemberUrbanAreas':{
					required:_msg.noMemberUrbanAreas
				},
				'consigneePostalcode':{
					required:_msg.content_required
				},
				'consigneePhone':{
					required:_msg.content_required
				}
			}
		});
		
		jQuery.validator.addMethod("milanoo_phone", function(value, element) {	
		  if(this.optional(element) || /^[\-\d]{6,17}$/.test(value))
		  {		  
			  return true;
		  }
		  if(value.length<1){
			  this.settings.messages.MemberContactPhone=_msg.noMemberPhone;
		  }else if(value.length < 6 || value.length > 17)
		  {
		  	 this.settings.messages.MemberContactPhone=_msg.ConsigneePhoneInvalidLength;	  
		  }else if(!value.match(/^[\-\d]+$/))
		  {
			  this.settings.messages.MemberContactPhone=_msg.ConsigneePhoneInvalidChar;		  
		  }
		  return false;
		}, "error");
	
		jQuery.validator.addMethod("milanoo_zip", function(value, element) {
			if(this.optional(element) || /^[a-zA-Z\d\s]+$/.test(value))
			{
				return true;
			}
			if(value.length<1 || $.trim(value).length==0)
			{
				this.settings.messages.MemberZip  = _msg.noMemberZip;
			}
			else if(! value.match(/^[a-zA-Z\d\s]+$/) )
			{
				this.settings.messages.MemberZip  = _msg.ConsigneeZipInvalidChar;
			}
			return false;
		},'error');
		
		jQuery.validator.addMethod("card_number", function(value, element) {	
			  if(this.optional(element) || /^[\-\d]{10,20}$/.test(value))
			  {		  
				  return true;
			  }	  
			  if(value.length<10){
				  this.settings.messages.cardno=_msg.pay_no_card_no;
			  }
			  if(!value.match(/^[\-\d]+$/))
			  {
				  this.settings.messages.cardno=_msg.pay_no_card_no;		  
			  }
			  return false;
		}, "error");
		$("#credit_pay").validate({
			event: "blur",
			rules: {
				cardno:{
					required:true,
					card_number:true
				}
			},
			messages: {
				select_card: {
					required: _msg.pay_no_card
				},
				cardno: {
					required: _msg.pay_no_card_no
				},
				cardHolderName: {
					required: _msg.pay_no_card_name
				},
				expirymonth: {
					required: _msg.pay_no_card_month
				},
				expiryyear: {
					required:  _msg.pay_no_card_year
				},
				cvc: {
					required: _msg.pay_no_card_cvc
				}
			}
		});



		// 根据php 传参，判断是否直接打开地址编辑
		if( _params.noShipping !== undefined && _params.noShipping == 1 ) {

			// $( '.s_edit_address' ).fancybox({
			// 	closeBtn: false, 
			// 	helpers: { 
			// 		overlay: { closeClick: false } 
			// 	} 
			// });
	
			if( $( 'input[name=address_id]' ).length ) {

				$( 'input[name=address_id]' ).each(function() {
					var box = $( this ).parent();

					if( $( this ).is( ':checked' ) ) {
						var editor = box.next( '.s_edit_address' );
						editor.click();
					}
				});
			} else {
				$( '#new_address_btn' ).click();
			}

		}


    });
	
	
});
