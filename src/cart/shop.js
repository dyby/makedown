


define(function( require, exports, module ){
	/*
     * 引入包 
     *
     */
    var _Base = require( 'base' ),
    	_Main = require( 'cart/main' ),

		_Ntab = require( 'ntab' ),
		_Droll = require( 'droll' ),
		_Form = require( 'ui.form' );

		
	/*
	 * 加载 fancybox 插件
	 *
	 */
	require( 'fancybox' );
    require( 'validate' );
	require( 'favorite' );
    
    $(function() {
    	
    	// 总价始终保持在可视区域
    	_Main.elemFixed( '.s_fixed_place', '.content' );

		_Form.validateNumber();

		var listItem_len = $('.s_roll ul li').length;

		if( listItem_len > 6){
			new _Droll( $( ".s_roll" )[0], {
				step: 155, moveNum: 6, index: 0, loop: false,
				onBeforeInView: function( list ){
					_Base.handLazy( list );
				}
			});
		}

		var listItem_len2 = $('.s_roll2 ul li').length;
		
		if( listItem_len2 > 6){

			new _Droll( $( ".s_roll2" )[0], {
				step: 155, moveNum: 6, index: 0, loop: false,
				onBeforeInView: function( list ){
					_Base.handLazy( list );
				}
		
			});
		}
		
		$( '.fancybox' ).fancybox();
		// 修改数量
		$( '.s_product_num' ).each(function() {

			this._value = $( this ).val();
			this._update = $( this ).parents( '.column' ).find( '.s_update_num' );
			this._update[0]._num = this;

		}).keyup(function( event ) {

			if( this._value != $( this ).val() ) {
				$( this._update ).show();

				if( event.keyCode == 13 ) {
					$( '.s_update_num' ).triggerHandler( 'click' );
				}
			} else {
				$( this._update ).hide();
			}
		});

		// 刷新页面
		$( '.s_update_num' ).click(function() {
			var id = $( this ).attr( 'href' ).replace( '#', '' ), num = parseInt( $( this._num ).val() );

			if( !isNaN( num ) && num > 0 ) {
				window.location.href = root_url+"shop/Cart-act-editnum-num-"+num+"-cartid-"+id+".html"; 
			}

			return false;
		});


		// 选择国家运费
		$('#countryShipping').change(function() {

			var cid = $( this ).find( 'option:selected' ).val();

			if( cid == 23 ) {
				$( '#tips_noship' ).show();	
			} else {
				$( '#tips_noship' ).hide();

				_Main.shipInfo( cid );
			}
		});

		// 进行默认选择
		var def_cid = $( '#countryShipping' ).find( 'option:selected' ).val();
		_Main.shipInfo( def_cid );


		// 使用折扣券
		$( '#libkey_btn' ).click(function() {
			_Main.shopCode( $( '#libkey' ).val() );
		});

		$( '.s_shopcode' ).live('click',function() {
			var t = $( this ).attr( 'type' );

			_Main.shopCode( $( '#libkey' ).val(), t );
		});

		// 取消折扣券
		$( '.s_cancel_shopcode' ).live('click',function() {
			_Main.cancelCoupon();
		});


		
		$( '#libkey' ).keyup(function( event ) {
			if( event.keyCode == 13 ) {
				_Main.shopCode( $( '#libkey' ).val() );
			}
		});

		$( '.couponData' ).change(function() {
			$( '#libkey' ).val( $( this ).val() ).focus();
		});


		// 登录注册切换
		$( ".tabs" ).each( function() {

	    	new _Ntab( this, {
		        currentClass: "current",
		        eventType	: "click",
		        handler		: "a"
	    	});

		});


	

		// 验证
		$("#s_form_login").validate({
			messages: {
				loginusername: _lang.noname,
				loginuserpass: _lang.nopass
			},
			submitHandler: function( form ) {

				$( '#error_login' ).hide();

				_Form.ajaxSubmit( form, _params.logurl, {
					onError: function( msg ) {
						$( '#error_login' ).html( msg ).show();
					}
				});

				return false;
			}
		});

		$( "#s_form_reg" ).validate({
			messages: {
				email	 : _lang.noname,
				UserPass : _lang.nopass,
				UserPass2: _lang.nopass
			},
			submitHandler: function( form ) {

				$( '#error_reg' ).hide();

				_Form.ajaxSubmit( form, _params.regurl, {
					onError: function( msg ) {
						$( '#error_reg' ).html( msg ).show();
					}
				});

				return false;
			}
		});


	});

});
