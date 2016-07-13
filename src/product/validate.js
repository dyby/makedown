define( 'vali', function( require, exports ) {
	
	var _Base = require( 'base' ),

		_Price = require( 'price' );
	
	// 判断商品表单是否可以提交
	// {_params.knum} 捆绑数量
	exports.lockedProductSubmit = function( hide_submit_tips ) {
		
		// 优先提示捆绑数量错误
		if( !exports.checkKnum() ) {
			// submitLocked = true;

			return true;
		}
		
		var submitLocked = false, 

			customSize = $( '#s-ptailor_checkbox' ), 

			proBox = $( '.pro_choose' ),

			tips = $( '.tips_product_locked' );

			
		var checkSKU = function() {

			// 循环select
			proBox.find( 'select.skuLinkage' ).each(function() {
				// 如果为不可用的不进循环
				if( !$( this ).is( ':disabled' ) ) {
					var selectedElem = $( this ).find( 'option:selected' );
					
					if( $.trim( $( this ).val() ) === '' || ( selectedElem && selectedElem.hasClass( 'no_stock' ) ) ) {
						submitLocked = true;
					}
				}
			});
		};
		
		//required
		proBox.find( "input.required" ).each(function() {
			if( $.trim( $( this ).val() ) == "" ) {
				submitLocked = true;
			}
		});

		
		// 如果只能自定义
		if( $( "#s-only_custom" ) && $( "#s-only_custom" ).length ) {
			
			if( proBox.find( 'input[type=radio]' ).length && !proBox.find( 'input[type=radio]:checked' ).length ) {
				submitLocked = true;
			}
			
			proBox.find( 'input.required' ).each(function() {
				if( $.trim( $( this ).val() ) === '' ) {
					submitLocked = true;
				}
			});
			
		} 
		// 可以进行其他属性的选择
		else {
			// 如果有自定义属性选择
			if( customSize && customSize.length ) {
				
				// 如果选择size 的select 是被禁用的
				if( proBox.find( ".skusize" ).is( ':disabled' ) ) {
					// 判断自定义尺码是否有勾选
					if( customSize.is( ':checked' ) ) {
						submitLocked = false;
					} else {
						submitLocked = true;
					}
				}
			}
			
			checkSKU();
		}
		
		var $only_custom = $( "#s-only_custom" );
		if( $only_custom && $only_custom.length && ( $only_custom.attr( "propertyType" ) == "other" || _params.size_count < 1 )  ) {
			checkSKU();
		}
		
		proBox.find( ".tips1, .tips2" ).each(function(){
			if( !$( this ).is( ":hidden" ) ) {
				submitLocked = true;
			}
		});
		
		// 如果需要传前后两个照片，则判断是否都传递了
		if( $( ".img-upload-button" ).length != $( ".img-upload-disabled" ).length ) {
			submitLocked = true;
		}
		
		if( !hide_submit_tips ) {
		// 属性已经选择, 此处只判断捆绑数量
		tips[ submitLocked ? 'fadeIn' : 'fadeOut' ]();
		}
		
		return submitLocked;
	};
	
	// 最低购买数量
	exports.checkKnum = function() {
		var allow = true, proqty_num = parseInt( $( "#proqty" ).val() );

		if( _params.knum && _params.knum != 1 ) {
			
			if( proqty_num < _params.knum ) {
				allow = false; $( "#s-knum_tips" ).fadeIn( 100 );
			} else {
				allow = true; $( "#s-knum_tips" ).fadeOut( 100 );
			}
		}
		
		return allow;
	};
	
	// 判断打包商品是否选择
	exports.submitPackage = function() {

		if( $( '.s_pack_goods' ).find( 'input[type=checkbox]:checked' ).length ) {

			$( '#package_error_tips' ).fadeOut( 100 );
			return true;
		}

		$( '#package_error_tips' ).fadeIn( 100 );
		
		return false;
	};
	
	// 获取提示信息
	exports.getSkuInfo = function( optionElem, stockNum, skuAllow ) {
		var type = $( optionElem ).parent().attr( 'sku:type' ), box = $( '#selected_' + type + '_Baseox' ), elem = $( '.selected_' + type );
	
		// 判断是否显示选择项的提示信息
		if( elem && elem.length ) {
			var pro = $( optionElem ).attr( "property" );
			
			var textinfo = '<span class="sizeinfo">'+ $( optionElem ).text() + '</span>';
			
			if( pro ) {
				textinfo += '<span class="proinfo">'+ pro +'</span>';
			}
			
			elem.html( textinfo );
			
			if( $.trim( $( optionElem ).val() ) !== '' ) {
				box.fadeIn();
			}
			
			// 全部都选择了则隐藏未选提示信息
			if( !tips.is( ':hidden' ) && !lockedProductSubmit() ) {
				tips.fadeOut();
			}
		}
		
		// 进行库存数量和输入数量的判断
		var isElem = $( '#instock' ), inElem = $( '#instockNum' ), pElem = $( '#proqty' );
		
		// 如果数据为空则不进行库存的
		if( skuAllow ) {
			if( stockNum == -1 ) {
				isElem.hide();
				return false;
			}
			// 库存提示
			isElem[ stockNum ? 'show' : 'hide' ]();
			
			if( stockNum ) {
				inElem.text( stockNum ).show();
				
				// 检查用户输入的库存数量
				var num = _Base.math.float( $.trim( pElem.val() ) );
				
				if( num > stockNum ) {
					pElem.val( stockNum );
					
					var fp_p = _Base.math.float( $( '.final_price' ).attr( 'price' ) );
					var pp_p = _Base.math.float( $( '#packagePrice' ).attr( 'price' ) );
					var p_p = _Base.math.float( $.trim( $( '#s-price' ).val() ) );
					
					$( '.final_price' ).attr( 'price', _Base.math.float( fp_p - p_p * ( num - stockNum ) ) );
					$( '#packagePrice' ).attr( 'price', _Base.math.float( pp_p - p_p * ( num - stockNum ) ) );
					
					$( '.final_price' ).find( '.smt_price' ).text( _Price.byState( $( '.final_price' ).attr( 'price' ) ) );
					$( '#packagePrice' ).find( '.smt_price' ).text( _Price.byState( $( '#packagePrice' ).attr( 'price' ) ) );
				}
			} else {
				inElem.hide().empty();
			}
		}
		
		// 当选择的值为please 时
		if( $.trim( $( optionElem ).parent().val() ) === '' ) {
			elem.html( '-/-' );
		}
	};


	// 购物车私人裁缝检查
	exports.checkCartPtailor = function() {
		var allow = true;

		if( !$( '#s-ptailor_checkbox' ).is( ':checked' ) ) {
			return true;
		}

		$( '#s-ptailor' ).find( "input[type=text]" ).each(function() {
			if( $.trim( $( this ).val() ) == "" ) {
				allow = false;
			}
		});

		$( '.tips_product_locked' )[ !allow ? 'fadeIn' : 'fadeOut' ]();
		
		return allow;
	}

	
	
});
