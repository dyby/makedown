


define( 'cart/main', function( require, exports, module ) {

	var _Base = require( 'base' ),	
		_Price = require( 'price' );


	var api = {};


	// 使某元素浮出原位置保持在可视区域
	// {elem} 要附近浮动的元素
	// {layout} 左右的基准容器
	api.elemFixed = function( elem, layout ) {
		var $fixed_elem = $( elem );

		if( !$fixed_elem.length ) return;
		
    	$fixed_elem.before( 
    		$fixed_elem[0]._fiexed_marker = $( '<div class="jc_fixed_maker" style="position: absolute;"></div>' )
    	);

    	$( window ).scroll(function() {
    		var s_top = $( window ).scrollTop() + $( window ).height();

    		if( s_top < $fixed_elem[0]._fiexed_marker.offset().top ) {
    			$fixed_elem.css({ 'position': 'fixed' }).addClass( 'jc_fixed_style' );

    			$fixed_elem.css({
    				'left': $( layout ).offset().left + $( layout ).outerWidth() - $fixed_elem.outerWidth( true )
    			});
    		} else {
    			$fixed_elem.css({ 'position': 'static' }).removeClass( 'jc_fixed_style' );
    		}
    	});
	};

	
	// 更改地址
	api.editAddress = function( id ){
		$.ajax({         
			type: 'POST',
			url : _params.url,
			data: "id="+id+"&act=edit",
			dataType:'json',
			success: function( data ) {
				if(data.length > 0){
					$( '#addnew' ).val( '0' );
					$( '#act' ).val('editpost');
					for(var d in data){
						if(data[d].types == 'text'){
							if($( '#' + data[d].key ).length){
								$( '#' + data[d].key ).val( data[d].value );
							}
						}
						
						if(data[d].types == 'select'){
							if($( '#' + data[d].key ).length){
								$( '#' + data[d].key ).find( 'option' ).each(function(){
									if($( this ).val() == data[d].value){
										$( this ).attr('selected','selected');
									}
								});
							}
						}
						
						if(data[d].types == 'radio'){
							if($( '.' + data[d].key ).length){
								$( '.' + data[d].key ).each(function() {
									if( $( this ).val() ==  data[d].value ) {
										$( '.' + data[d].key ).removeAttr( 'checked' );
										$( this ).attr( 'checked', 'checked' );
										$( this ).parent().find('label').addClass('checkedEnd');

									}
								});
								
								//$( '.' + data[d].key ).triggerHandler( 'change' );
							}
						}
						
					}
				}else{
					$( '#act' ).val('addpost');
				}
			}
		});
	};

	// 新增地址
	api.newAddress = function(){
		$( ':input','#addressForm' ).not(':button,:submit,:reset,:radio').val('').removeAttr('checked').removeAttr('selected');
		var countryId = _params.countryId;
		console.log(countryId);
		$( '#consigneeStateId' ).val( countryId );
		$( '#addnew' ).val( '1' );
		$( '#act' ).val('editpost');
	};


	// 获取ship 信息
	// {cid} 国家 id
	api.shipInfo = function( cid ) {

		$.ajax({   
			type 	: "get",  
			cache 	:"false",  
			url 	: root_url+"index.php?module=ajax&action=shipping&countryid="+cid+"&"+Math.random(), 
			datatype: "html",

			success: function( data ) {

				if( data.length > 0 ) {

					data = $.parseJSON( data );

					var logi_html = data.html.replace( /&lt;/g, '<' ).replace( /&gt;/g, '>' );
					
					$( '#s_logistics' ).html( logi_html );

					if( data.js_shipping_off.length > 0 ) {
						$( '#item_shipping_save' ).html( data.js_shipping_off );
					} else {
						$( '#item_shipping_save' ).hide();
					}
					
					_Price.update( $( '#item_shipping_price' ), data.js_ship_price ? data.js_ship_price : 0 );
					_Price.update( $( '#item_shipping_old_price' ), data.js_old_price ? data.js_old_price : 0 );


					// coupon 总价
					var coupon_price = $( '#s_coupon_price' ).length ? $( '#s_coupon_price' ).attr( 'price' ) : 0;
					
					var total_price = _Base.math.float( data.js_ship_price ) + _Base.math.float( $( "#s_cart_price" ).attr( "price" ) ) - _Base.math.float( coupon_price );
					
					// 如果是会员
					if($( "#cartPriceMemberTotal" ).length ) {
						var vip_price = _Base.math.float( $( "#cartPriceMemberTotal" ).attr( "price" ) );
						total_price -= vip_price;
					}

					// 如果是dropshipper
					if($( "#dropshipperTotal" ).length ) {
						var dropshipper_price = _Base.math.float( $( "#dropshipperTotal" ).attr( "price" ) );
						total_price -= dropshipper_price;
					}
					
					_Price.update( $( "#item_shipping_total" ), total_price );

				}
			}
		});

	};



	// 使用折扣券
	// {no_coupon} 建军在这里传递的 0 ， 1
	api.shopCode = function( libkey, no_coupon ) {

		if( !libkey || libkey === undefined ) {
			return false;
		}

		var opt_str = '';

		if( no_coupon !== undefined ) {
			opt_str = 'enter=1&useNoConpou='+ no_coupon + '&';
		}
		
		$.ajax({   
			type: "get", 
			cache:"false",  
			url: root_url + "index.php?module=ajax&action=promotionCode&libkey="+libkey + "&" + opt_str + Math.random(), 
			datatype: "json",		
			success: function(data) {
				data = $.parseJSON( data );
				
				if( data.status == 1 ) {
					$( "#s_coupon_error" ).html( data.error ).show();
				}
				if( data.status == 0 ) {
					$( "#s_coupon_error" ).hide();
					var gaq = _gaq || [];
					gaq.push(['_trackEvent','UseCoupon','click_apply','UseCoupon']);
					window.location.reload();
				}
			}
		}); 
	};


	api.cancelCoupon = function() {
		$( '#libkey' ).val( '' );
		$( '#s_coupon_error' ).fadeOut( 100 );

		$( '.couponData' ).removeAttr( 'checked' );
	};



	/*
	 * 
	 *
	 */
	api.cart = {

		subtotal: function() {
			return _Base.math.float( $( '#s_subtotal' ).attr( 'price' ) );
		},

		// 运输方式
		// 以及运费保险
		shipType: function() {
			if( !$( '.logistics_radio' ).length ) {
				return null;
			}

			var elem = $( '.logistics_radio:checked' );

			var is_in = this.isInsurance();

			return {
				sale: is_in ? 
						_Base.math.float( elem.attr( 'insurance_pricetotal' ) ) :
						_Base.math.float( elem.attr( 'price' ) ),

				old : is_in ? 
						_Base.math.float( elem.attr( 'insurance_old_pricetotal' ) ) :
						_Base.math.float( elem.attr( 'oldprice' ) ),	

				off : is_in ?
						elem.attr( 'insurance_shipping_off' ) : 
						elem.attr( 'shippingoff' )

 			};
		},

		// 保险价格
		isInsurance: function() {
			if( !$( '#insurance' ).length ) {
				return 0;
			}

			var elem = $( '#insurance' ), ckd = elem.is( ':checked' ) ? true : false;
			
			if( _msg ) {
				$( '.s_ship_name' ).html( ckd ? _msg.ship_insur : _msg.ship );
			}

			//return ckd ? _Base.math.float( elem.attr( 'price' ) ) : 0;
			return ckd;
		},

		// coupon 总价
		coupon: function() {
			if( !$( '#s_coupon_price' ).length ) {
				return 0;
			}

			return _Base.math.float( $( '#s_coupon_price' ).attr( 'price' ) );
		},

		// 支付方式价格
		pay: function() {
			var elem_pay = $( '#paymethod' );

			if( !elem_pay.length ) {
				return 0;
			}

			var p = 0, 
				elem_back_tips = $( '#bank_to_bank_tips' ),
				// 银行汇款价格
				elem_country = $( '#worldPay_country' ), 
				// 已选项
				wc_selected = elem_country.find( 'option:selected' );

			p = elem_country && wc_selected.attr( 'orderdiscount' ) ? _Base.math.float( wc_selected.attr( 'orderdiscount' ) ) : 0;

			if( elem_pay.find( 'option:selected' ).val() != 'yhhk' ) {
				elem_back_tips.hide();
				// 价格清空
				p = 0;
			} else {
				_Price.update( $( '#s_back-price' ), p );
				elem_back_tips.show();
			}

			return p;
		},
		
		// 折扣价
		// 会员价
		vip: function() {
			if( !$( '#cartPriceMemberTotal' ).length ) {
				return 0;
			}

			return _Base.math.float( $( '#cartPriceMemberTotal' ).attr( 'price' ) );
		},

		// 折扣价
		// drop shipper
		dropshipper: function() {
			if( !$( '#dropshipperTotal' ).length ) {
				return 0;
			}

			return _Base.math.float( $( '#dropshipperTotal' ).attr( 'price' ) );
		},

		// 更新价格
		update: function() {
			var st = this.shipType();

			var total_price = this.subtotal() + ( st ? st.sale : 0 ) - this.pay() - this.coupon() - this.vip() - this.dropshipper();
			
			_Price.update( $( '#s_shipping_total' ), total_price );
		},

		// 控制表单提交
		checkSubmit: function() {
			var allow = true;

			// 无运费
			if( this.shipType() == null ) {
				allow = false;
			}
			
			// 支付方式
			if( !$( '#paymethod' ).length || ( $( '#paymethod' ).length && $( '#paymethod' ).find( 'option:selected' ).val() == '' ) ) {
				allow = false;
			}

			if( $( '#paymethod' ).length && $( '#paymethod' ).find( 'option:selected' ).val() == 'yhhk' && $( '#worldPay_country' ).length && $( '#worldPay_country' ).find( 'option:selected' ).val() == '' ) {
				allow = false;
			}
			
			if( allow ) {
				$( '#s_proceed_pay' ).removeAttr( 'disabled' ).removeClass( 'disabled' );
			} else {
				$( '#s_proceed_pay' ).addClass( 'disabled' ).attr( 'disabled', 'disabled' );
			}
		}

	};
	
	return api;
});
