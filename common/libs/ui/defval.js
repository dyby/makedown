/** 
 * 输入框提示层
 * 
 */

define( 'defval', function( require, exports ) {
	

	var defval = function( target, options ) {
		this.target = target;
		
		this.opt = {
			fontColor: '#999'
		};
		
		$.extend( this.opt, options );
		
		this.init();
	};
	
	defval.prototype = {
		
		init: function() {
			// 清空源input 的value，同时保存提示文字
			var id = 's-defval-'+ ( new Date() ).getTime() * Math.floor( Math.random() * 9999 ), 
				
				t = $( this.target ), v = $( this.target ).attr( 'defval' ),
				
				// 如果input 添加 float ， 则添加position 则会出现位置上的bug
				fixed_pos = t.css( 'float' ) != 'none' ? '' : 'position:relative;';
				
			t.attr( 'defval', v ).val( '' );
			
			// 创建一个外层容器, 解决在其他元素append 或者高度变化的时候，造成的 提示层依旧在原位置问题
			// fixed_pos 锁定位置, 避免该输入框前后dom 发生变化时候 造成的提示层位置不变
			t.wrap( '<span class="s-defval_wrap" style="'+ fixed_pos +'"></span>' );
			
			// 创建每个input 的提示层
			t.after( '<div id="'+ id +'" class="s-defval" style="position:absolute;">'+ v +'</div>' );
			
			this.target._dv = document.getElementById( id );
			
			this.set();
			
			this.bind();
		},
		
		// 设置提示层的位置大小
		set: function() {
			var type_arr = { 'margin': [], 'padding': [] }, num_arr = {}, pos_arr = [ 'top', 'right', 'bottom', 'left' ],
				
				t = $( this.target ), tp = t.parents( '.s-defval_wrap' )
				
				dv = $( this.target._dv ),
			
				// border 造成的div 位置偏移
				// left border + right border
				// 如果 border: none 则直接 = 2
				b_lr_rela = this.getNum( $( this.target ).css( 'borderLeftWidth' ), $( this.target ).css( 'borderRightWidth' ) ) * 0.5 + 2,
				b_tb_rela = this.getNum( $( this.target ).css( 'borderTopWidth' ), $( this.target ).css( 'borderBottomWidth' ) ) * 0.5 + 2,
				
				line_hei = ( t.outerHeight() - b_tb_rela - 2 );
			
			if( t.is( 'textarea' ) ) {
				line_hei = '22';
			}
			
			if( isNaN( b_lr_rela ) ) { b_lr_rela = 2;  }
			if( isNaN( b_tb_rela ) ) { b_tb_rela = 2;  }
			
			// margin & padding
			for( var key in type_arr ) {
				
				$.each( pos_arr, function( i, item ) {
					var _att = key + '-' + item;
					
					type_arr[ key ].push( t.css( _att ) );
				});
				
				num_arr[ key ] = {};
				num_arr[ key ].tb = this.getNum( type_arr[ key ][ 0 ], type_arr[ key ][ 2 ] );
				num_arr[ key ].lr = this.getNum( type_arr[ key ][ 1 ], type_arr[ key ][ 3 ] );
				
				type_arr[ key ] = $.isArray( type_arr[ key ] ) ? type_arr[ key ].join( ' ' ) : null;
			}
			
			dv.css({
				'left'			: ( t.position().left + b_lr_rela ) + 'px',
				'top'			: ( t.position().top + b_tb_rela ) + 'px',
				'width'			: ( t.outerWidth() - num_arr[ 'padding' ].lr - b_lr_rela ) + 'px',
				'height'		: ( t.outerHeight() - num_arr[ 'padding' ].tb - b_tb_rela ) + 'px',
				'line-height'	: ( line_hei - num_arr[ 'padding' ].tb ) + 'px',
				'padding'		: type_arr[ 'padding' ],
				'margin'		: type_arr[ 'margin' ],
				'color'			: this.opt.fontColor,
				'overflow'		: 'hidden',
				'text-overflow'	: 'ellipsis',
				'white-space'	: 'nowrap',
				'background'	: 'none',
				'cursor'		: 'text'
			});
			
			this.target._dv._t = t;
		},
		
		// 获取两个css 字符串之和
		getNum: function( num1, num2 ) {
			var v = parseInt( num1.replace( 'px', '' ) ) + parseInt( num2.replace( 'px', '' ) )
			return isNaN( v ) ? 0 : v;
		},
		
		bind: function() {
			// 提示层点击变淡同时获得焦点
			$( this.target._dv ).click(function() {
				$( this ).fadeTo( 60, 0.4 );
				$( this._t ).focus();
			});
			
			$( this.target )
				.css( 'outline', 'none' )
				.blur(function() {
					var v = $.trim( $( this ).val() );
					
					if( !v.length && v != $( this._dv ).text() ) {
						$( this._dv ).show().fadeTo( 60, 1 );
					}
				})
				.keyup(function() {
					var v = $.trim( $( this ).val() );
					
					if( v.length > 0 ) {
						$( this._dv ).hide();
					}
				})
				// 获得焦点只减淡
				.focus(function() {
					var v = $.trim( $( this ).val() );
					
					if( !v.length && v != $( this._dv ).text() ) {
						$( this._dv ).fadeTo( 60, 0.4 );
					}
				});
		}
	};
	
	return defval;

});
