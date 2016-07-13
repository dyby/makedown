/**
 * 
 *  
 */
seajs.config({
	alias: {
		'css.loader': pub_url +'image/css/html5.loader.css'
	},
	charset: 'utf-8'
});

define( 'ui.form', function( require, exports ) {
	
	var B = require( 'base' );
	
	var api = {};
	
	// html5 加载动画样式
	var html5Loading = {

		play: function( target ) {

			target = $( target )[0];
			
			if( !$( target ).find( '.html5-loading' ).length ) {

				$( target ).append(
					target._loader = $( '<div class="html5-loading"><i></i></div>' )
				);
			}
			
			this.set( target );
		},

		set: function( target ) {

			target = $( target )[0];

			var elem = $( target ), min_size = Math.min( elem.outerWidth( true ), elem.outerHeight( true ) ),
				// 宽大于高的按钮
				is_hori = elem.outerWidth() > elem.outerHeight() ? true : false;
			
			target._loader.css({
				width	: min_size - ( target._loader.outerWidth( true ) - target._loader.innerWidth() ),
				height	: min_size - ( target._loader.outerWidth( true ) - target._loader.innerWidth() )
			}).fadeIn( 100 );
		},

		stop: function( target ) {

			if( target && target._loader ) {
				target._loader.fadeOut( 100 );
			}
		}

	};
	
	//require.async( 'css.loader' );
	
	// 避免重复提交
	api.submit = {
		
		lock: function( target, loading_lang ) {

			target = $( target )[0];

			var expr = /input|button/i.exec( target.nodeName );

			if( !expr ) {
				return;
			}
			
			target._class = 'disabled';

			if( loading_lang !== null ) {
				if( /input/i.test( expr[0] ) ) {
					target.__store = [ $( target ).val(), 'val' ];
					$( target ).val( loading_lang );
				}
				if( /button/i.test( expr[0] ) ) {
					target.__store = [ $( target ).text(), 'text' ];
					$( target ).text( loading_lang );
				}
			}
			
			$( target ).addClass( target._class ).attr( 'disabled', 'disabled' );
			
			// 调用html5 包
			if( B.browser.ishtml5() ) {
				//html5Loading.play( target );
			}

		},
		
		unlock: function( target ) {

			target = $( target )[0];
			
			// 调用html5 包
			if( B.browser.ishtml5() ) {
				//html5Loading.stop( target );
			}

			// 判断是否设置过loading 文字
			if( target.__store !== undefined ) {
				$( target )[ target.__store[1] ]( target.__store[0] );
			}
			
			$( target ).removeAttr( 'disabled' ).removeClass( target._class );
		}
	};


	// 获取表单中的所有参数
	api.getParams = function( form ) {

		var params = null, arr = [];

		$( form ).find( 'input[type=text], input[type=password], input[type=radio], input[type=checkbox], input[type=hidden], select' ).each(function() {

			var key = $( this ).attr( 'name' ), value = null;

			if( /select/i.test( this.nodeName ) ) {
				value = $.trim( $( this ).find( 'option:selected').val() );
			} else {
				value = $.trim( $( this ).val() );
			}

			if( key && value ) {
				arr.push( key + '=' + value	);
			}
		});

		if( arr.length ) {
			params = arr.join( '&' );
		}

		return params;
	}

	// ajax 提交
	api.ajaxSubmit = function( form, url, options ) {

		var opt = {
			onError: function() {},
			onSucccess: function() {}
		};

		$.extend( opt, options );

		var params = api.getParams( form );

		api.submit.lock( $( form ).find( 'button[type=submit]' ), _lang.loading );

		$.ajax({
			type: 'POST',
			url	: url,
			data: params,
			error: function() {},
			success: function( data ) {

				data = $.parseJSON( data );
				console.log( data )
				if( data.error_status == 0 ) {
					window.location.href = data.forward;
				} else {

					if( opt.onError ) opt.onError( data.msg );

					api.submit.unlock( $( form ).find( 'button[type=submit]' ) );
				}
			}
		});

	};
	

	var match_arr = {
		// 整数
		// '*int'	: /^-?\d+$/,
		// 非负整数
		'int'	: /^\d+$/,
		// 正整数
		'+int'	: /^[0-9]*[1-9][0-9]*$/,
		// 浮点数
		// '*float': /^(-?\d+)(\.\d+)?$/,
		// 非负浮点数
		'float'	: /^\d+\.?(\d+)?$/,
		// 正浮点数
		'+float': function( n ) {

			if( match_arr[ 'float' ].test( n ) ) {
				return true;
			}

			return false;
		}
	};

	// 限定输入类型为数字
	api.validateNumber = function() {
		
		$( 'input[number-type]' ).each(function() {

			this._prev_val = $.trim( $( this ).val() );

			$( this )
				.bind( 'change, keyup', function() {
					var type = $( this ).attr( 'number-type' ), cur_val = $.trim( $( this ).val() );
					
					if( cur_val == '' || cur_val == this._prev_val ) {
						return;
					}

					if( type == undefined ) {
						type = '+int';
					}
					
					var expr = match_arr[ type ];

					var is_match = $.isFunction( expr ) ? expr( cur_val ) : match_arr[ type ].test( cur_val );

					$( this ).val( is_match ? cur_val : this._prev_val );

					this._prev_val = $( this ).val();
				})

				// 浮点数小数输入结束判断是否为 0
				.blur(function() {

					var type = $( this ).attr( 'number-type' ), cur_val = $.trim( $( this ).val() );

					if( /\+float/.test( type ) && parseFloat( cur_val ) <= 0 ) {
						$( this ).val( 1 );
					}
				});

		});
	};
	
	
	return api;
	
});