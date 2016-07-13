/**
 * 创建一个select 模型
 * 由该模型代替默认的select 进行显示
 * 原select 隐藏
 * 
 * 模型所触发的选择事件直接触发原select
 * 同时具有select 的键盘事件功能
 *  
 */
define( 'jselect', function( require ) {
	
	var prevTarget = null, _list = [];
	
	var jselect = function( elems, options ) {
		var _list = $( elems );
		
		_list.each(function( i ) {
			this._index = i;
			new jselectMain( this, _list, options );
		});
	};
	
	/**
	 * sml:sametrigger 具有该属性的元素事件统一触发
	 * @param {Object} target
	 * @param {Object} 
	 * @param {Object} options
	 */
	function jselectMain( target, _this, options ) {
		this.target = target;
		
		this._total_len = _this.length;
		
		// 可选项
		this.opt = {
			// 可见多少个，超出则使用系统滚动条
			viewNum			: 8,
			// 禁用样式
			disabledClass	: "model_disabled",
			// 设置不可点击项
			unClickClass	: "disabled_click",
			// 已经被选择的样式
			selectedClass	: this.name + '-selected',
			// callback params
			// 1. this 环境为选中的option
			// 2. 点击的索引值
			// 3. 当前点击的模型项
			onSelect		: function() {}
		};
		
		$.extend( this.opt, options );
		
		this.Init();
	}
	
	jselectMain.prototype = {
		
		name: 'pack_jselect',
		
		Init: function(){
			this.GetModel();
			
			if( $( this.target ).is( ":disabled" ) ) {
				//return;
			}
			
			this.Bind();
		},
		
		// 获取select 模型
		GetModel: function() {
			var _this = this, id = $( this.target ).attr( 'id' ), zi = parseInt( this._total_len ) - parseInt( this.target._index );
			
			// 没有id 则使用随机数
			if( id == undefined || id == '' ) {
				id = ( new Date() ).getTime() * Math.round( Math.random() * 999 );
			}
			
			id = id + '-' + this.name;
			
			if( zi == undefined || isNaN( zi ) ) {
				zi = 0;
			}
			
			var // 当前select 已经选中的元素
				selectedOp = $( this.target ).find( 'option:selected' ),
				// 当前select 附加的样式
				curClass = $( this.target ).attr( 'class' ),
				
				// 模型元素
				// 将一个便于首字母搜索的input 藏在div 之后
				htmlArr = [
					'<div style=\'z-index:'+ zi +';\' id=\''+ id +'\' class=\''+ this.name +' '+ curClass +'\'>\
						<div style="position:relative;z-index:1;overflow:hidden;" class=\''+ ( selectedOp.attr( "class" ) || "" ) +'\' value=\''+ selectedOp.val() +'\'>\
							<span>'+ selectedOp.text() +'</span>\
							<em class=\''+ this.name +'_arrow\'><em></em></em>\
						</div>\
						<input style="position:absolute;z-index:-1;width:1px;height:1px;border:0;margin:0 0 0 -10000px;" id=\''+ id +'-search\' class=\''+ this.name +'-search\' type="text" value="" />\
						<ul style=\'z-index:'+ zi +';\'>'
				];
			
			$( this.target ).find( 'option' ).each(function( i ) {
				var selectedClass = $( this ).attr( 'class' ) ? $( this ).attr( 'class' ) : '',
					// option 上原始的样式
					oClass = $( this ).attr( 'class' ) ? 'oclass='+ $( this ).attr( 'class' ) : '';
				
				if( selectedOp.index() == i ) {
					selectedClass += ' '+_this.opt.selectedClass;
				}
				
				var bgpart = "", s_color = $( this ).attr( "s-color" );
				if( s_color ) {
					var bg = '';
					if( /^#/.test( s_color ) ) {
						bg = 'background-color: '+ s_color;
					} else {
						bg = 'background-image: url("'+ s_color + '")';
					}
					
					bgpart = "<b class='s-color' style='"+ bg +"'></b>";
				}
				
				htmlArr.push( '<li class="'+ selectedClass +'" '+ oClass +' value="'+ $( this ).val() +'">'+ bgpart + '<span>' + $( this ).text() +'</span></li>' );
			});
			
			htmlArr.push( '</ul></div>' );
			
			if( $( "#"+ id ).length ) {
				$( "#"+ id ).remove();
			}
			
			$( this.target ).after( htmlArr.join( '' ) );
			
			// 用于外部进行调用
			this.target._$smodel = $( '#' + id );
			
			if( $( this.target ).is( ":disabled" ) ) {
				this.target._$smodel.addClass( this.opt.disabledClass ).attr( "disabled", "disabled" );
			}
			
			_list.push( this.target._$smodel );
			
			this._$focus = this.target._$smodel.find( 'div' );
			this._$ul = this.target._$smodel.find( 'ul' );
	
			this._$search = $( '#'+ id +'-search' );
			
			// 设置模型基础样式
			this.SetStyle();
		},
		
		// 设置模型基础样式
		// 用户自定义设置为 rel='width:200,height:100'
		SetStyle: function() {
			var _this = this;

			// 如果没有设置宽度
			var real_w = this.target._$smodel.find( '.'+ this.name + '_arrow' ).outerWidth( true ) + $( this.target ).outerWidth( true );
			this.target._$smodel.css( 'width', real_w );
			
			// 模型实际默认宽度=宽度+下拉箭头宽度
			var toSet = $( this.target ).attr( 'rel' );
			
			// 使用用户自定义配置进行设置
			if( toSet ) {
				var setArr = toSet.split( ',' );
				
				for( var i = 0; i < setArr.length; i ++ ) {
					var s = setArr[i], sArr = s.split( ':' ), pro = sArr[0], val = sArr[1];
					
					this.target._$smodel.css( pro, val );
				}
			}
			this.SetModelListHeight();
			
			//$( this.target ).hide();
			$( this.target ).css({
				width: 0, height: 0, position: 'absolute'
			});

			this._$ul.hide();
		},
		
		// 设置模型下拉曾的高度
		SetModelListHeight: function() {
			
			var _this = this;
			
			// 真实超过可视数量时添加滚动样式
			if( this.opt.viewNum && $( this.target ).find( 'option' ).length > this.opt.viewNum ) {
				var hei = 0;
				
				this._$ul.find( 'li' ).each(function( i ) {
					if( i < _this.opt.viewNum ) {
						hei += $( this ).outerHeight( true );
					}
				});
				
				this._$ul.css({ height: hei, 'overflow-y': 'scroll' });
			}
		},
		
		// 当前点击项设置为z 最高
		GetMaxIndex: function() {
			var z = 0, list = $( ".pack_jselect" ), len = list.length;
			
			list.each(function() {
				var zi = parseInt( $( this ).css( "z-index" ) );
				
				z = Math.max( z, zi ? zi : len );
			});
			
			return z + 1;
		},
		
		// 绑定点击事件
		Bind: function( fn ) {
			var _this = this;
			
			// 模拟select 的交互动作
			this._$focus.bind( 'click.'+ this.name, function( event ) {
				clearTimeout( _this.timer );
				
				$( _this._$ul ).css( "z-index", _this.GetMaxIndex() );
				
				if( _this.target._$smodel && _this.target._$smodel.hasClass( _this.opt.disabledClass ) || _this.target._$smodel.attr( "disabled" ) !== undefined ) {
					return;
				}
				
				_this.timer = setTimeout(function() {
					
					if( event.target !== prevTarget ) {
						$.each( _list, function( i, item ) {
							item.find( "ul" ).hide();
						});
					}
			
					_this[ _this._$ul.is( ':hidden' ) ? 'Open' : 'Close' ]();
					
					prevTarget = event.target;
				}, 100 );
				
				return false;
			});
			
			// 监听原始Select 的变化
			$( this.target ).bind( 'change.'+ this.name, function() {
				var selectedOption = $( this ).find( 'option:selected' ), selectedIndex = selectedOption.index();
				// 修改模型样式以及显示的值
				_this.UpdateModel( selectedIndex );
			});
			
			// 绑定选中select 的事件
			this._$ul.find( 'li' )
				.each(function( i ) {
					this._index = i;
				})
				.bind( 'click.'+ this.name, function() {
					if( $( this ).hasClass( _this.opt.unClickClass ) ) {
						return false;
					} else {
						_this.Apply( this._index );
					}
				})
				.bind( 'mouseover.'+ this.name, function() {
					var firstWord = $( this ).text().charAt( 0 );
					
					_this._$search.val( firstWord );
				});
			
			// 点击模型框区域以外的交互
			this._$ul.bind( 'mouseover.'+ this.name, function() {
				_this._in = true;
			});
			
			this._$ul.bind( 'mouseout.'+ this.name, function() {
				_this._in = false;
			});
	
			// 执行首字母定位
			this._$search.bind( 'keyup.'+ this.name, function( event ) {
				var v = _this._$search.val(),
					
					lastWord = v.charAt( v.length - 1 ), 
					
					index = _this.matchIndex( lastWord );
				
				// 第一个选项不进行搜索建议
				if( index !== null && index !== 0 ) {
					_this.UpdateModel( index );
					
					_this.SetDropScrollTop( index );
				}
				
				if( event.keyCode == 13 ) {
					_this.Apply( index );
					
					_this._$search.val( '' );
				}
			});
	
			// 当鼠标位于模型框之外同时触发点击事件时关闭下拉框
			$( document ).bind( 'click.'+ this.name, function() {
				if( !_this._in ) {
					_this.Close();
				}
			});
			
			
			this._$focus.bind( 'selectstart', function(){ return false; });
			this._$focus.bind( 'select', function(){ document.selection.empty(); });
		},
		
		// 进行选择
		Apply: function( index ) {
			var _this = this;
			
			var elem = $( this.target ).attr( "sml:sametrigger" ) ? 
			
							// 相关联select 同样触发change 事件
							$( $( this.target ).attr( "sml:sametrigger" ) ):
							
							$( this.target );
			
			elem.each(function() {
				
				var curOption = $( this ).find( "option" ).eq( index ), curLi = _this._$ul.find( 'li' ).eq( index );
				
				//$( this ).find( "option" ).removeAttr( "selected" );
				curOption.attr( 'selected', 'selected' );
				// 同时触发该 select 元素的change 事件
				$( this ).triggerHandler( 'change' );
	
				_this.opt.onSelect.call( curOption, index, curLi );
			});
			
			this.UpdateModel( index );
			// 隐藏下拉框
			this._$ul.fadeOut( 100 );
		},
		
		// 显示下拉框
		Open: function() {
			this._$ul.css({ width: this._$focus.innerWidth() });
			
			this._$search.focus();
			this._$ul.fadeIn( 100 );
		},
		
		// 关闭下拉框
		Close: function() {
			var _this = this;
			
			$.each( _list, function( i, item ) {
				item.find( "ul" ).hide();
			});
			
			this._$ul.fadeOut( 100 );
			this._in = false;
		},
		
		// 修改模型选项样式以及显示的值
		// 当前选择的索引值
		UpdateModel: function( index ) {
			var list = this._$ul.find( 'li' ), c = list.eq( index ).attr( 'oclass' ) == undefined ? '' : list.eq( index ).attr( 'oclass' );
			
			this._$focus.attr({ "value": list.eq( index ).attr( 'val' ), "class": c });
			this._$focus.find( 'span' ).html( list.eq( index ).text() );
					
			// 当前点击项添加样式
			list.removeClass( this.opt.selectedClass );
			list.eq( index ).addClass( this.opt.selectedClass );
		},
		
		// 快捷选择之后，如果下拉列表存在滚动条，则设置滚动条
		SetDropScrollTop: function( index ) {
			var list = this._$ul.find( 'li' ), cur = list.eq( index );
			
			this._$ul.scrollTop( cur.outerHeight( true ) * index );
		},
		
		// 匹配是否存在有与按键项匹配的首字母项
		// 返回匹配的项的索引
		matchIndex: function( str ) {
			
			var list = this._$ul.find( 'li' );
			
			for( var i = 0; i < list.length; i ++ ) {
				var item = list.eq( i ), firstWord = item.text().charAt( 0 );
				
				if( firstWord.toLocaleUpperCase() === str.toLocaleUpperCase() ) {
					return i;
				}
			}
			
			return null;
		}
	}
	
	return jselect;
	
});