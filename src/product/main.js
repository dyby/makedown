define( 'main', function( require, exports ) {
	
	/**
	 * 引入包
	 *  
	 */
	var _Base = require( 'base' ),
		_Price = require( 'price' ),
		_Vali = require( 'vali' ),
		_Cover = require( 'ui.cover' );

	// 打包价
	var combo = function() {

		var list = $( ".s_pack_goods" ), price = 0, save = 0;
		
		var has_main = false, main_ck = false;
		
		list.each(function() {
			var cx = $( this ).find( 'input[type=checkbox]' );
			
			if( cx.attr( "mainflag" ) ) { has_main = true; }
			if( cx.attr( "mainflag" ) && cx.is( ':checked' ) ) { main_ck = true; }
		});
		
		list.each(function() {
			var is_checked = $( this ).find( 'input[type=checkbox]' ).is( ":checked" )
			
			if( is_checked ) {
				
				// 如果打包商品中存在主商品
				// 判断主商品是否被选中
				if( has_main ) {
					// 主商品被选中
					if( main_ck ) {
						price += _Base.math.float( $( this ).attr( 'sale-price' ) );

						save += ( _Base.math.float( $( this ).attr( 'old-price' ) ) - _Base.math.float( $( this ).attr( 'sale-price' ) ) );
					} 
					// 主商品未选中
					else {
						price += _Base.math.float( $( this ).attr( 'old-price' ) );
					}
				} 
				// 主商品的时候打包商品中则不会出现 mainflag 标记
				else {
					price += _Base.math.float( $( this ).attr( 'sale-price' ) );

					save += ( _Base.math.float( $( this ).attr( 'old-price' ) ) - _Base.math.float( $( this ).attr( 'sale-price' ) ) );
				}
			}
		});
		
		return {
			total: _Base.math.float( price ),
			save : _Base.math.float( save )
		}
	};

	exports.combo = combo;
	
	
	// 当size chart 加载完成，将size chart 中的内容克隆到弹出层中
	function addpopsize() {
		if( $( '#s-custom_sizechart' ).length ) {
			
			if( $( '.S_size_tab02_sizechart' ).length ) {
				var sizeClone = $( '.S_size_tab02_sizechart' ).clone();
				
				$( '#s-custom_sizechart' ).empty().append( sizeClone );
				sizeClone.show();
				
				sizeClone.find( "img" ).each(function() {
					var s = $( this ).attr( 'original' );
					
					$( this ).attr( 'src', s );
				});
			} else {
				$( '#clone_size_chart' ).hide();
			}
		} else {
			$( '#clone_size_chart' ).hide();
		}
	}
	
	// 隐藏显示尺码表
	function getCustomSizeChart( target ) {
		
		var csElem = $( '#s-custom_sizechart' ), isHide = csElem.is( ':hidden' );
		
		if( target === -1 ) {
			csElem.hide();
			
			$( target ).removeClass( 'unfold' ).addClass( 'fold' );
			return;
		}
		
		csElem[ isHide ? 'show' : 'hide' ]();
		
		if( isHide ) {
			$( target ).addClass( 'unfold' ).removeClass( 'fold' );
		} else {
			$( target ).removeClass( 'unfold' ).addClass( 'fold' );
		}
	}
	
	
	
	// 批发价格调整后重新修改打包出售的价格
	var setComboPrice = function() {
		var pro_price = _Base.math.float( $( '.s-final_price' ).attr( 'price' ) );

		_Price.update( $( '#combo_price' ), pro_price + combo().total )
	};
	
	
	/**
	 * 批发价以及输入数量
	 * {arr} 批发价数组
	 * {defPrice} 产品 原始价格，如果为只能自定义的商品，这个原始价格为产品价格+定制价格
	 * {elem} input target
	 * {knum} 捆绑数量
	 *  
	 */
	function inArrayRange( arr, num ) {
		if( !num || !arr || num == '' ) return false;
		
		if( $.isArray( arr ) ) {
			if( num >= arr[0] && num <= arr[1] ) return true;
		} else {
			if( num >= arr ) return true;
		}
		
		return false;
	} 

	exports.getSales = function( arr, defPrice, elem ) {
		
		defPrice = _Base.math.float( defPrice );
		
		var sarr = $.parseJSON( arr ), num = _Base.math.float( $( elem ).val() );
		
		var sp = _Base.math.float( $( '#s-price' ).val() );
		
		// 如果有库存数量
		// 判断输入的数量是否大于库存数量
		var inElem = $( '#instockNum' ), isnum = _Base.math.float( $.trim( inElem.text() ) );
		
		if( $.trim( inElem.text() ) !== '' ) {
			if( !isNaN( isnum ) && num > isnum ) {
				$( elem ).val( isnum );
				num = isnum;
			}
		}
		
		// 修正输入的数量始终为1
		if( num < 1 ) {
			num = 1;
		}
		
		// 判断捆绑数量
		if( _params.knum && _params.knum != 1 ) {
			$( "#s-knum_tips" )[ num < _params.knum ? "fadeIn": "fadeOut" ]( 200 );
		}
		
		var my_price = defPrice, fp = $( '.s-final_price' );
		
		// 选择了主商品，，则使用打折价
		var selectMain = false;

		$( ".s_pack_goods" ).each(function() {
			var cbx = $( this ).find( 'input[type="checkbox"]' );

			if( cbx.attr( "mainflag" ) && cbx.is( ":checked" ) ) {
				selectMain = true;
				
				my_price = $( "#s-price" ).attr( "price" );
			}
		});

		
		// 数量为1 或者没有折扣价
		if( num === 1 || !sarr || $.isEmptyObject( sarr ) ) {
			_Price.update( fp, num * ( _Base.math.float( my_price ) + ptailor.price.fee() ) );

			_Price.update( $( '.product_price' ), my_price );
			
			$( '#s-price' ).data( "changed", false );
			
		// 数量大于1的时候判断是否使用批发价
		} else if( num > 1 && sarr && !$.isEmptyObject( sarr ) ) {
			
			var pprice = my_price;
			
			for( var i = 0; i < sarr.length; i ++ ) {
				var json = sarr[i], numArr = json.salenum2 === -1 ? json.salenum1 : [ json.salenum1, json.salenum2 ];
				
				if( inArrayRange( numArr, num ) ) {
					pprice = json.saleprice;

					_Price.update( $( '.product_price' ), pprice );
					break;
				}
			}
			
			var tprice = num * ( _Base.math.float( pprice ) + ptailor.price.fee() );
			
			_Price.update( fp, tprice );
			
			$( '#s-price' ).data( "changed", true );
		}
		
		else {}

		_Vali.lockedProductSubmit( true );
		
		setComboPrice();
	}
	
	
	
	// 私人裁缝
	var ptailor = exports.ptailor = {
		
		// 数值是否在范围内
		_custom_size_inrange: true,
		
		// [0] default: select
		// [1] 定制尺寸
		custom_type: 0,
		
		// 价格计算函数
		price: {
			
			// gift 总价
			gift: function() {
				var price = 0;
				
				$( ".s-gift_handler" ).each(function() {
					
					if( $( this ).is( ":checked" ) ) {
						price += _Base.math.float( $( this ).attr( "price" ) );
					}
				});
				
				return price;
			},
			
			// 原始单价
			def: function() {
				return _Base.math.float( $( "#s-price" ).val() );
			},
			
			// 当前数量
			num: function() {
				return _Base.math.float( $( "#proqty" ).val() );
			},
			
			// 附加价格总价
			fee: function() {
				return ptailor.price.custom.get() + ptailor.price.hole.get();
			},
			
			// 用于显示当前选择的显示价格
			feeView: function() {
				return ptailor.price.custom.get(-1) + ptailor.price.hole.get();
			},
			
			// 定制部分的价格设置
			custom: {
				
				// 设置定制价格，get 方法调用
				set: function( price, list ) {
					this.price = _Base.math.float( price );
					
					this.list = list;
				},
				
				// 获取在允许提交情况下的定制价格
				// 传递 -1 则为直接获取 price
				get: function() {
					var p = this.price || 0;
					
					if( $( "#custom-price" ).length ) {
						p = p + _Base.math.float( $( "#custom-price" ).val() );
					}
					
					if( arguments[0] == -1 ) {
						return p;
					}
					
					// 选择情况直接进行价格设置
					if( ptailor.custom_type == 0 ) {
						return 0;
					} 
					// 定制情况下，在所有必选都填写的情况下，才进行价格显示
					else {
						var allow = ptailor.checkInput( this.list );
						
						return allow ? p : 0;
					}
				}
			},
			
			// 当前抠洞部分的总价设置
			hole: {
				set: function( inputs ) {
					this.inputs = inputs;
				},
				
				// 被选个数
				checkedLen: function() {
					var i = 0;
					
					if( this.inputs.is( ":disabled" ) ) {
						return 0;
					}
					
					this.inputs.each(function() {
						if( $( this ).is( ":checked" ) ) {
							i ++;
						}
					});
					
					return i;
				},
				
				get: function() {
					var price = 0;
					
					/*
					if( this.inputs.is( ":disabled" ) ) {
						return price;
					}
					*/
					
					this.inputs.each(function() {
						if( !$( this ).is( ":disabled" ) && $( this ).is( ":checked" ) ) {
							price += _Base.math.float( $( this ).attr( "price" ) );
						}
					});
					
					return _Base.math.float( price );
				},
				
				// 启用抠洞多选框
				enabled: function() {
					this.inputs.removeAttr( "disabled" );
				},
				
				// 禁用抠洞多选框
				disabled: function() {
					this.inputs.attr( "disabled", "disabled" );
				}
			}
		},
		
		/*
		 * 设置传给后端的数据
		 * 
		 */
		setData: function( type ) {
			var selects = $( "#s-size" ).find( "select" ),
				inputs = $( "#s-pri_cussize" ).find( 'input[type=text], input[type=radio]' );
			
			this.select_type = type;
			
			if( !selects.length && !inputs.length ) {
				this.custom_type = 1;
				$( "#s-custom_type" ).val( 1 );
			} else {
			
				if( type === undefined ) {
					
					var isStandard = this.checkSelect( selects ), isCustom = this.checkInput( inputs );
					
					// 给隐藏域添加值
					if( isStandard ) {
						this.custom_type = 0;
					}
					if( isCustom ) {
						this.custom_type = 1;
					}
					
				} else {
					this.custom_type = type;
				}
			
				$( "#s-custom_type" ).val( this.custom_type );
			}
			
			// 后端需要判断该元素的 disabled 属性
			if( this.custom_type == 0 ) {
				$( "#s-custom_key" ).attr( "disabled", "disabled" );
			} else {
				$( "#s-custom_key" ).removeAttr( "disabled" );
			}
		},
		
		/*
		 * select模块 与定制模块 切换
		 * 
		 * @param
		 * 	layout_s: 展示容器的元素 class
		 * 	control_s: 控制展示容器的元素 class
		 * 	default_s: 默认显示的容器
		 * 	hidden_s: 传给后端的定制类型
		 * 				0 代表选择尺寸
		 * 				1 代表定制
		 * 
		 */
		switchType: function() {
			var arg = arguments;
			
			var _this = this, layout_s = arg[0], control_s = arg[1], default_s = arg[2], hidden_s = arg[3];
			
			// 控制是否显示
			$( layout_s ).each(function() {
				if( this !== $( default_s )[0] ) {
					$( this ).hide();
				}
			});
			
			// 控制按钮事件
			$( layout_s ).find( control_s ).click(function() {
				var sr = $( this ).attr( "href" ), price = $( this ).attr( "price" ), type = $( this ).attr( "type" );
				
				// 设置当前类型
				//_this.custom_type = type;
				
				// 当前元素的集合
				var list = ( type == 0 ) ?
								// 标准尺码集合 
								$( sr ).find( "select" ) :
								// 自定义集合 
								$( sr ).find( 'input[type=text], input[type=radio]' );
				
				set( price, list );
				
				$( layout_s ).hide();
				$( sr ).show();
				
				// 开启标准尺码选择
				if( type == 0 ) {
					_this.DisabledInput();
					$( "#s-ptailor" ).find( ".skusize" ).removeAttr( "disabled" ).removeClass( "disabled" );
				} else {
					_this.EnabledInput();
					$( "#s-ptailor" ).find( ".skusize" ).attr( "disabled", "disabled" ).addClass( "disabled" );
				}
				
				_this.setData();
				
				_this.submitSet( list );
				
				_Price.update( $( ".s-fee_price_view" ), _this.price.feeView() );
				
				return false;
			});
			
			// 设置价格
			// price: 价格
			// input or select
			function set( price, list ) {
				_this.price.custom.set( price, list );
				
				var // 产品价格
					p = _Base.math.float( $( "#s-price" ).val() ), 
					
					// 产品数量
					num = _Base.math.float( $.trim( $( '#proqty' ).val() ) );
				
				_Price.update( $( ".s-fee_price_view" ), _this.price.fee() );
			}
		},
		
		/* 
		 * 弹出控制
		 * 
		 * @param
		 * 	input_s: 触发弹出层的input
		 * 	edit_s: 编辑按钮，仅仅弹出私人裁缝
		 * 	cancel_s: 私人裁缝弹出层中的取消按钮
		 * 
		 */
		popper: function() {
			var arg = arguments;
			
			var _this = this, input_s = arg[0], edit_s = arg[1], cancel_s = arg[2];
			
			var typeMatcher = {
				0: "#s-size",
				1: "#s-pri_cussize"
			};
			
			// 购物车页面编辑不弹出
			if( /cart/.test( ptailor.page ) ) {

				$( input_s ).change(function() {

					if( $( this ).is( ":checked" ) ) {

						ptailor.custom_type = 1;

						_this.EnabledInput();
						_this.DisabledSelect();
						
						// 弹出时重新启用抠洞
						_this.price.hole.enabled();

						$( '#s-ptailor' ).show();
						$( ".skusize" ).addClass( "disabled" ).attr( "disabled", "disabled" );
					} 
					// 关闭私人裁缝
					else {

						ptailor.custom_type = 0;
						
						_this.DisabledInput();
						_this.EnabledSelect();

						$( '#s-ptailor' ).hide();
						$( ".skusize" ).removeAttr( "disabled" ).removeClass( "disabled" );
					}


					var total_price = ( ptailor.price.def() + ptailor.price.fee() ) * ptailor.price.num();
					
					_Price.update( $( '.s-final_price' ), total_price );
					_Price.update( $( '#increase_price' ), ptailor.price.fee() * ptailor.price.num() );
				});
			}
			// 终端页弹出
			else {

				$( input_s ).change(function() {
					
					var key = _this.custom_type;
					
					// 打开私人裁缝
					if( $( this ).is( ":checked" ) ) {
						_this.EnabledInput();
						_this.EnabledSelect();
						
						// 弹出时重新启用抠洞
						_this.price.hole.enabled();
						
						$( edit_s ).click();
						$( this ).removeAttr( "checked" );
						
						// addpopsize();
					}
					// 取消私人裁缝
					else {
						_this.DisabledInput();
						_this.DisabledSelect();
						
						$( cancel_s ).click();
					}
					
				});
			}
		},
		
		/*
		 * apply_s: 提交按钮
		 * cancel_s: 取消按钮
		 * handler_s: 触发弹出的input checkbox
		 * edit_s: 触发弹出私人裁缝弹出层，供编辑功能
		 *  
		 */
		bind: function() {

			var arg = arguments;
			
			var _this = this, apply_s = arg[0], cancel_s = arg[1], handler_s = arg[2], edit_s = arg[3], fee_s = arg[4];
			
			if( /cart/.test( ptailor.page ) ) {

			} 
			// 终端页
			else {

				// 弹出控制
				$( edit_s ).click(function() {
					_this.autoChoose();
				});
				
				// 提交按钮
				$( apply_s ).bind( "click", function() {
					var inputs = $( "#s-pri_cussize" ).find( 'input[type=text], input[type=radio]' );
					
					$.fancybox.close();
					
					// 禁用抠洞
					_this.price.hole.enabled();
					_this.setData();
					
					if( _this.custom_type == 0 ) {
						_this.DisabledInput();
						_this.EnabledSelect();
						$( handler_s ).removeAttr( "checked" );
						$( edit_s ).hide();
					} else {
						// 如果只有标准尺码时，选择尺码之后不禁用
						if( inputs.length ) {
							_this.DisabledSelect();
						
							$( '.selected_'+ $( 'select.skusize' ).attr( 'sku:type' ) ).html( 
								"<a onclick='jQuery( \"#s-ptailor_edit\" ).triggerHandler( \"click\" )' href='javascript:void(0);'>"+ $( "#s-ptailor_checkbox" ).next().text() + "</a>" 
							);
							
							$( '#selected_'+ $( 'select.skusize' ).attr( 'sku:type' ) + "_box" ).fadeIn( 100 );
						}
					}
					
					// 如果没有使用定制尺码或者没有进行抠洞的选择，则不勾选 checkbox
					if( _this.custom_type != 0 || _this.price.hole.checkedLen() != 0 ) {
						$( handler_s ).attr( "checked", "checked" );
						$( edit_s ).show();
					}
					
					_Price.update( $( fee_s ), _this.price.fee() );
					_Price.update( $( '.s-final_price' ), ( _this.price.fee() + _Base.math.float( $( "#s-price" ).val() ) ) * _Base.math.float( $( "#proqty" ).val() ) );
					
					setComboPrice();
					
					return false;
				});
				
				// 取消按钮
				$( cancel_s ).bind( "click", function() {
					// 关闭弹出层
					$.fancybox.close();
					
					// 禁用抠洞
					_this.price.hole.disabled();
					_this.DisabledInput();
					_this.EnabledSelect();
					
					_this.setData( 0 );
					
					// 克隆的size chart 部分折叠
					getCustomSizeChart( -1 );
					
					$( handler_s ).removeAttr( "checked" );
					
					$( edit_s ).hide();
					
					var price = _this.price.fee();
					if( $( "#custom-price" ).length ) {
						price = price + _Base.math.float( $( "#custom-price" ).val() );
					}

					_Price.update( $( fee_s ), price );
					_Price.update( $( '.s-final_price' ), ( _this.price.fee() + _Base.math.float( $( "#s-price" ).val() ) ) * _Base.math.float( $( "#proqty" ).val() ) );
					
					setComboPrice();
					
					var selected = $( 'select.skusize' ).eq(0).find( "option:selected" );
					var info = selected.val() == "please" ? "-/-" : selected.text();
					
					$( '.selected_'+ $( 'select.skusize' ).attr( 'sku:type' ) ).html( info );
					return false;
				});

			}
		},
		
		/*
		 * 根据实际情况进行自动切换显示的部分
		 *  
		 */
		autoChoose: function() {
			var selects = $( "#s-size" ).find( "select" ),
			
				selectedOption = selects.find( "option:selected" ),
				
				// 没有抠洞
				noExistDig = !$( "#s-pri_dighole" ) || !$( "#s-pri_dighole" ).length;
			
			// 没有抠洞，弹出私人裁缝则直接打开定制
			if( noExistDig ) {
				
				if( !selects.is( ":disabled" ) && selectedOption.val() !== "please" ) {
					$( "#s-pri_cussize" ).find( ".s-size_choose" ).triggerHandler( "click" );
				} else {
					$( "#s-size" ).find( ".s-size_choose" ).triggerHandler( "click" );
				}
			} 
			// 有抠洞
			else {
				// 定制已选则打开定制
				if( selects.is( ":disabled" ) ) {
					$( "#s-size" ).find( ".s-size_choose" ).triggerHandler( "click" );
				}
				// 打开标准尺码
				else {
					$( "#s-pri_cussize" ).find( ".s-size_choose" ).triggerHandler( "click" );
				}
			}
			
		},
		
		/*
		 * 抠洞
		 * 
		 * @param
		 * 	layout_s: 外容器
		 *  
		 */
		dighole: function() {
			var arg = arguments, layout_s = arg[0];
			
			var _this = this, fpElem = $( '.s-final_price' ), ppElem = $( '#packagePrice' ), ipElem = $( '#increase_price' );
			
			var inputs = $( layout_s ).find( 'input[type=checkbox]' );
			
			this.price.hole.set( inputs );
			
			inputs.click(function() {
				var // 总价
					fp = _Base.math.float( fpElem.attr( 'price' ) ), 
					// 当前是否已选
					isChecked = $( this ).is( ':checked' );
				
				var p = _Base.math.float( $( this ).attr( 'price' ) ) * ( isChecked ? 1 : -1 );
				
				_Price.update( $( ".s-fee_price_view" ), _this.price.feeView() );
			});
		},
		
		/*
		 * 定制
		 * 该选项控制是否可以提交
		 * 
		 * @param
		 * 	layout_select_s: 外容器
		 * 	layout_custom_s: 外容器
		 *  
		 */
		cussize: function() {
			var arg = arguments, layout_select_s = arg[0], layout_custom_s = arg[1];
			
			var _this = this, 
				
				// 选择部分
				selects = $( layout_select_s ).find( "select" ),
				
				// 定制部分
				inputs = $( layout_custom_s ).find( 'input[type=text], input[type=radio]' );
			
			inputs.bind( 'keyup.cussize,change.cussize', function() {
				
				_this.submitSet( inputs );
				
				return false;
			});
			
			selects.bind( "change.cussize", function() {
				_this.submitSet( selects );
				
				return false;
			});
			
			this.submitSet();
		},
		
		// 检查定制输入框是否正确
		checkInput: function( inputs ) {
			if( !inputs || !inputs.length ) {
				return true;
			}
			
			var len = 0, allow = true;
			
			if( inputs.is( ":disabled" ) ) {
				return false;
			}
			
			inputs.each(function() {
				if( $.trim( $( this ).val() ) == "" ) {
					allow = false;
				}
				if( $( this ).is( ":radio" ) && !$( this ).is( ":checked" ) ) {
					len ++;
				}
			});
			
			if( len == 2 ) {
				allow = false;
			}
			
			return allow && this._custom_size_inrange;
		},

		DisabledInput: function() {
			var inputs = $( "#s-pri_cussize" ).find( 'input[type=text], input[type=radio]' );
			
			inputs.attr( "disabled", "disabled" );
		},

		EnabledInput: function() {
			var inputs = $( "#s-pri_cussize" ).find( 'input[type=text], input[type=radio]' );
			
			inputs.removeAttr( "disabled" );
		},
		
		// 检查标准尺码是否已选
		checkSelect: function( selects ) {
			var allow = true;
			
			if( !selects || !selects.length ) {
				return true;
			}
			
			if( selects.is( ":disabled" ) ) {
				return false;
			}
			
			selects.each(function() {
				var option = $( this ).find( "option" );
				
				// 下拉项只有一项，则直接允许
				if( option.length == 1 ) {
					// do something
				} 
				// 不是选择的第一项都允许提交
				else {
					var selectedOption = $( this ).find( "option:selected" );
					
					allow = selectedOption.index() == 0 ? false : true;
				}
			});
			
			return allow;
		},
		
		DisabledSelect: function() {
			$( ".skusize" ).addClass( "model_disabled" ).attr( "disabled", "disabled" );
		},

		EnabledSelect: function() {
			$( ".skusize" ).removeAttr( "disabled" ).removeClass( "model_disabled" );
		},
		
		/* 提交按钮的设置
		 * arg length == 0
		 *	禁用按钮
		 * arg length == 1
		 * 	list: inputs || select
		 */
		submitSet: function( list ) {
			
			// 如果只能抠洞则不进行按钮控制
			if( !$( ".left_con" ).length ) {
				return false;
			}
			
			var applyBtn = $( ".apply_but" );
			
			if( !list || !list.length ) {
				applyBtn.addClass( "disabled" ).attr( "disabled", "disabled" );
				return;
			}
			
			// 设置按钮样式
			set( this[ list.is( "select" ) ? "checkSelect" : "checkInput" ]( list ) );
			
			function set( allow ) {
				// 禁止提交
				if( !allow ) {
					applyBtn.addClass( "disabled" ).attr( "disabled", "disabled" );
				}
				// 允许提交
				else {
					applyBtn.removeAttr( "disabled" ).removeClass( "disabled" );
				}
			}
		},
		
		/*
		 * 数值要在范围允许的范围内
		 * 
		 * @param
		 * 	layout_s: 外容器
		 *  select_s: 触发事件的select
		 *  isCartPage: 是否为购物车页面
		 *  
		 */
		inrange: function( layout_s, select_s, isCartPage ) {
			var arg = arguments, layout_s = arg[0], select_s = arg[1], isCartPage = arg[2];
			
			var _this = this, inputs = $( layout_s ).find( 'input[type=text], input[type=radio]' );
			
			var cur_unit = $( select_s ).filter( ':checked' ).val();
		
			inputs.bind( 'keyup.inrange, change.inrange', function() {
				checkRange( inputs, this );
				
				_this.submitSet( inputs );
			});
			
			$( select_s ).bind( 'change.inrange', function() {
				
				$( 'label.custom_unit' ).text( $( this ).val() );
				$( 'label.custom_unit_kg' ).text( $( this ).attr( 'aunit' ) );
				
				_this.unitSwitch( $( layout_s ), cur_unit, select_s );
				
				cur_unit = $( this ).val();
				
				checkRange( inputs, this );
			});
			
			// 检查当前项是否在允许范围内
			function checkRange( items, target ) {
				_this._custom_size_inrange = true;
				
				$( target ).each(function() {
					// text 检验输入的值
					if( $( this ).is( ":text" ) ) {
						var cur_unit = $.trim( $( select_s ).filter( ':checked' ).val() ), num = _Base.math.float( $.trim( $( this ).val() ) ), cur_range = $.trim( $( this ).attr( cur_unit ) );
						
						if( cur_range && cur_range != '' && !isNaN( num ) ) {
							var isOut = false, arr = cur_range.split( ',' );
							
							var min = _Base.math.float( arr[0] ), max = _Base.math.float( arr[1] );
							if( min && !isNaN( min ) && num < min ) {
								isOut = true;
								_this._custom_size_inrange = false;
							}
							
							if( max && !isNaN( max ) && num > max ) {
								isOut = true;
								_this._custom_size_inrange = false;
							}
							
							var box = $( this ).parent();

							if( isCartPage ) {
								//box = $( this ).parent().parent().next();
							}
							
							var tips_key = $( select_s ).filter( ':checked' ).val() == 'cm' ? '.tips1' : '.tips2', curTips = box.find( tips_key );
							
							box.find( '.tips1, .tips2' ).hide();
							curTips[ isOut ? 'show' : 'hide' ]();
						}
						
					}
				});
				
			}
		},
		
		/* 
		 * 英寸，公斤相应单位之间的换算
		 * 
		 * @param
		 * 	layout_s: 外容器
		 *  prev_unit: 上次的单位
		 * 
		 */
		unitSwitch: function( layout_s, prev_unit, select_s ) {
			
			var json = {
				// 长度
				1: 2.54,
				// 重量
				2: 0.45359237
			};
			
			var inputs = $( layout_s ).find( 'input[type=text]' );
			
			if( prev_unit == $( select_s ).filter( ':checked' ).val() ) {
				return;
			}
			
			inputs.each(function() {
				var num = 0, v = $.trim( $( this ).val() ), type = $.trim( $( this ).attr( 'units' ) );
				
				if( v !== '' && type != undefined && type != '' ) {
					
					if( prev_unit == 'in' ) {
						v *= json[ type ];
					} else {
						v /= json[ type ];
					}
					
					toChange( this, v );
				}
			});
			
			function toChange( target, num ) {
				// 保留两位小数
				num = Math.round( num * Math.pow( 10, 1 ) ) / Math.pow( 10, 1 );
				
				$( target ).val( num );
			}
		}
		
	};




	// 打包商品功能脚本
	exports.apfunc = function( list, coverSelector ) {

		var _list = list, flagExist = false;
			
		var idArrayElem = $( '#addition_products_id_array' );

		// 判断是否存在为选择的项
		function setSelect( select ) {
			var allow = true, popper = $( select ).parents( '.se_color_size' );

			$( select ).each(function() {
				
				if( $.trim( $( this ).find( 'option:selected' ).val() ) == '' ) {
					allow = false;
				}
			});

			if( allow ) {
				popper.find( '.select_but' ).removeClass( 'disabled' ).removeAttr( 'disabled' );
			} else {
				popper.find( '.select_but' ).addClass( 'disabled' ).attr( 'disabled', 'disabled' );
			}
		}
		
		// 更新价格
		function updatePrice( elem ) {
			
			// 将选中的产品放入隐藏域
			var arr = [];
		
			var // 打包总价
				combo_price = $( '#combo_price' ),

				combo_save = $( '#combo_price_save' ); 
			
			var p = ( ptailor.price.fee() + ptailor.price.def() ) * ptailor.price.num() + ptailor.price.gift() + combo().total;

			_Price.update( combo_price, _Base.math.float( p ) );

			_Price.update( combo_save, combo().save );

			//combo_price_save
			
			var has_main = false, main_ck = false;
			
			_list.each(function() {
				
				var cx = $( this ).find( 'input[type=checkbox]' );
				
				if( cx.attr( "mainflag" ) ) {
					has_main = true;
				}
				
				if( cx.attr( "mainflag" ) && cx.is( ':checked' ) ) {
					main_ck = true;
				}
			});
			
			// 主商品作为礼品的时候并且被勾选了，才会修改显示价格
			_list.each(function() {
				
				var iscd = $( this.checkbox ).is( ':checked' );
				
				if( iscd ) {
					arr.push( $( this.checkbox ).attr( 'id' ).replace( 'ap_', '' ) );
				}
				
				if( has_main ) {
					var ap_np = main_ck ? $( this ).attr( 'sale-price' ) : $( this ).attr( 'old-price' );
					
					_Price.update( $( this ).find( '.goods_price' ), ap_np );
				}
			});
			
			idArrayElem.val( arr.join( ',' ) );
		}
		
		// 取消选中的产品
		function toCancel( elem ) {
			
			elem.submitBtn.addClass( 'disabled' ).attr( 'disabled', 'disabled' );
			
			elem.checkbox.removeAttr( 'checked' );

			_Cover.close();
			
			// 判断是否使用原价
			if( elem.checkbox.attr( 'mainflag' ) ) {
				gvs.ap_use_oldprice = true;
			}
			
			updatePrice( elem );

			$( elem ).find( '.goods_price' ).removeClass( 'selected' );
		}


		// 选择项
		$( '.goods_price' ).click(function() {

			var box = $( this ).parents( '.s_pack_goods' ), popper = box.find( '.se_color_size' );

			if( $( this ).hasClass( 'selected' ) ) {
				toCancel( box[0] );
			} else {

				if( popper.length ) {

					setSelect( box.find( 'select.adtype' ) );

					_Cover.open( popper, { coverOn: $( '#s_combo_box' ) });
				} 
				// 无弹出层则直接选择
				else {

					box.find( 'input[type="checkbox"]' ).attr( 'checked', 'checked' );
					$( box ).find( '.goods_price' ).addClass( 'selected' );

					updatePrice( box );

					_Vali.submitPackage();
				}
			}
		});
		
		// li 列表
		_list.each(function() {

			var _this = this;
			
			this.checkbox = $( this ).find( 'input[type=checkbox]' );

			//this.data = $( this ).find( 'input[type=hidden]' );
			this.poper = $( this ).find( '.se_color_size' );
			
			this.submitBtn 	= this.poper.find( '.select_but' );
			this.cancelBtn 	= this.poper.find( '.cancel_but' );
			this.closeBtn 	= this.poper.find( '.closebtn' );
			
			this.selectElem = this.poper.find( 'select.adtype' );
			
			this.newprice = $( this ).attr( 'sale-price' );
			this.oldprice = $( this ).attr( 'old-price' );
			
			if( this.checkbox.attr( 'mainflag' ) ) {
				flagExist = true;
			}
			
			// 判断submit 按钮提交事件是否激活
			this.selectElem.change(function() {

				setSelect( _this.selectElem );
			});
			
			// 提交按钮
			this.submitBtn.click(function( event ) {
				event.preventDefault();
				
				if( _this.submitBtn.hasClass( 'disabled' ) ) {
					return false;
				}

				_this.checkbox.attr( 'checked', 'checked' );
				$( _this ).find( '.goods_price' ).addClass( 'selected' );

				_Cover.close();

				updatePrice( _this );

				_Vali.submitPackage();
			});
			
			this.cancelBtn.click(function( event ) {
				toCancel( _this );
			});
			
			this.closeBtn.click(function( event ) {
				_this.poper.hide();
			});

		});
	};

});



//到货通知
	function emailAlertClick(ProductsId){
		Email = jQuery('#nosale_email').val();
		
		var isEmail = function( value ) {
			return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		};
		
		if( !isEmail( Email ) ) {
			return false;
		}
		
		jQuery.ajax({
		    url: root_url+'index.php?module=ajax&action=nosale',
		    type: 'GET',
		    data:"&Email="+Email+"&ProductId="+ProductsId,
		    timeout: 30000,
		    error: function() {
                alert("System error!");
	        },
		    success: function(data){
		    	if(data.length > 0){
		    		jQuery('#notice_box2').text(data);
		    	}
				
		    	jQuery('#notice_box2').fadeIn( 200 );
		    	// jQuery('#notice_box').hide();
				jQuery.fancybox.close();
				
				setTimeout(function(){ jQuery('#notice_box2').fadeOut( 200 ); }, 2000 );
		    }
		});
	}