/**
 * 基础的底层包
 *  
 */
define( 'base', function( require, exports ) {
	
	exports.now = function() {
		return ( new Date() ).getTime();
	};
	
	// 唯一不重复的id 
	exports.uid = function( start, len ) {
		var str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" + ( new Date() ).getTime(), len = len || 12;
		
		var temp = [];

		for( var i = 0; i < len; i ++ ) {
			temp.push( str.charAt( Math.floor( Math.random() * str.length ) ) );
		}
		
		return ( start !== undefined ? ( start + '-' ) : '' ) + temp.join( "" );
	}
	
	/**
	 * 监听器
	 * 
	 */
	exports.listen = {
		
		_t: null,
		
		// 窗体大小有没有发生改变
		resize: function( callback ) {
			clearTimeout( this._t );
			
			this._t = setTimeout(function() {
				$( window ).resize(function() {
					callback();
				});
			}, 79 );
		}
	};
	
	
	/**
	 * page 信息
	 * 
	 */
	exports.page = {
		
		// window 高宽
		screen: {
			width: function() {
				return $( window ).width() + $( window ).scrollLeft();
			},
			
			height: function() {
				return $( window ).height() + $( window ).scrollTop();
			}
		}
	};
	
	
	/**
	 * 数据处理
	 * 
	 */
	exports.chars = {
		
		// 转换为 json 格式
		toJson: function( str ) {
			var json = {}, arr = str.split( ';' );
			
			for( var i = 0; i < arr.length; i ++ ) {
				
				var item = arr[i].split( ':' );
				
				json[ item[0] ] = item[1];
			}
			
			return json;
		},
		
		// json 转换为字符串
		toStr: function( json, s1, s2 ) {
			var arr = [];
			
			for( var key in json ) {
				arr.push( key + ( s1 || ':' )  + json[ key ] );
			}
			
			return arr.join( s2 || ';' );
		},
		
		// 将一个字符串分段,
		// return array: 始终返回一个切割好的字符串数组或原字符串数组(字符串长度小于num)
		//	@param
		// 	str: 要分段的字符串，必选
		// 	num: 以多少个字符为一个组，必选
		//  dir: 从字符串的开始或结束开始切换(默认为1，即从开始位置切割；-1为从结束位置切割)
		strcut: function( str, num, dir ) {
			if( str.length <= num ) {
				return [ str ];
			} 
			
			var temp = [], arr = [], index = 0;
				
			for( var i = 0; i < str.length; i ++ ) {
				temp.push( str.charAt( i ) );
			}
			
			// 反向切割分组
			if( dir === -1 ) {
				temp.reverse();
			}
			
			for( var i = 0; i < temp.length; i ++ ) {
				// 每num 个字符为一组
				if( i !== 0 && ( i % num == 0 ) ) {
					// 将分完组的字符也进行一次反向
					if( dir === -1 ) {
						arr[ index ].reverse();
					}
					
					arr[ index ] = arr[ index ].join( '' );
					index ++;
				}
				
				if( !arr[ index ] ) {
					arr[ index ] = [];
				}
				
				// 如果为最后一项
				if( i === temp.length - 1 ) {
					arr[ index ].push( temp[i] );
					
					if( dir === -1 ) {
						arr[ index ].reverse();
					}
					
					arr[ index ] = arr[ index ].join( '' );
					break;
				}
				
				arr[ index ].push( temp[i] );
			}
			
			return dir === -1 ? arr.reverse() : arr;
		}
		
	};
	
	
	/**
	 * 数学函数包
	 * 
	 */
	exports.math = {
		
		// 随机函数
		// 随机数   最大值 为   end + start， 最小值为 start
		rand: function( end, start ) {
			var num = Math.floor( Math.random() * end );
			
			return ( start || 0 ) + num;
		},
		
		// 把数字转换为浮点数
		// @param {num}: 要转换的数字
		// @param {pos}: 小数点后保留的位数
		float: function( num, pos ) {
			var mynum = typeof num === 'number' ? num : parseFloat( num ), mypos = pos || 2;
			
			if( isNaN( mynum ) ) {
				return null;
			}
			
			return Math.round( mynum * Math.pow( 10, mypos ) ) / Math.pow( 10, mypos );
		}
	};
	
	
	/**
	 * 判断浏览器相关属性
	 *  
	 */
	exports.browser = {
		
		ishtml5: function() {
			if( typeof( Worker ) !== undefined ) {
				return true;
			}
			
			return false;
		}
	}
	
	
	
	/**
	 * 等待图片加载
	 * @params: { url: 原始对象集合: Array } || url || image element array
	 * @params: Function
	 * @Callback 1.image target, 2.是否为缓存
	 *  
	 */
	exports.imgLoader = function( param, callback ) {
		var data = {};
		
		if( $.isPlainObject( param ) ) {
			data = param;
		} 
		else if( $.isArray( param ) || ( $.type( param ) === 'object' && !$.isPlainObject( param ) ) ) {
			$.each( param, function() {
				data[ $( this ).attr( 'src' ) ] = this;
			});
		} 
		else if( typeof param === 'string' ) {
			data[ param ] = [];
		}
		
		for( var key in data ) {
			
			var url = key, img = new Image();
			
			img.src = url;
			
			img._callback = callback;
			img._orgi = data[ key ];
			
			if( !img.complete ) { 
				$( img ).load(function() {
					this._callback.call( this._orgi.length ? this._orgi : this, false );
				});
			}
			// 如果图片已经存在于浏览器缓存，直接调用回调函数
			else {
				// 如果为 true 则表示在缓存中
				img._callback.call( img._orgi.length ? img._orgi : img, true );
				return;
			}
		}
	};
	
	
	
	// 手动切换 src - lazyload
	exports.handLazy = function( list ) {
		
		$( list ).each(function() {
			var _image = $( this ).find( 'img' ), o = _image.attr( 'src1' ) || _image.attr( 'original' ), s = _image.attr( 'src' );
			
			if( o && o != '' ) {
				_image.attr( 'src', o ).removeAttr( 'src1' ).removeAttr( 'original' );
			}
		});
	};

	
	// lazyload
	exports.lazyload = function( target, beginDis ) {
		// Lazy image array[object]
		var	lazyArray = $(target);
		
		// Get page top method
		function pageTop() {
			return ( document.body.clientHeight < document.documentElement.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight ) + Math.max( document.documentElement.scrollTop, document.body.scrollTop );
		}

		// Image load method
		function imgLoad() {
			// Each the images
			lazyArray.each(function() {
				var oft = $( this ).offset();
				
				if( !oft || this.nodeType === undefined ) return;
				
				if( oft.top <= pageTop() + ( beginDis || 0 ) ) {
					var original = $( this ).attr( 'original' );
					
					// To display the image
					if( original ) {
						$( this ).attr( 'src', original ).removeAttr( 'original' );
					}
				}
			});
		}

		// Default Check
		imgLoad();

		// Bind the scroll event for window
		$( window ).bind( 'scroll', function() {
			imgLoad();
		});
	};



	// @PARAM
	//	1. elem[element]: srcollto element or srcollto top
	//	2. duration[int]: ms
	//	3. yOffset[int]: offset top
	exports.goto = function( options ) {
		var timerId = null;
		
		clearTimeout( timerId );
		
		var opt = {
			elem	: null,
			duration: 400,
			yOffset: 0
		};
		
		$.extend( opt, options );
		
		opt.elem = !$.isPlainObject( options ) ? $( options ) : $( opt.elem );
		
		var endpos = 0, 
			st = $( window ).scrollTop(), 
			start = (new Date()).getTime(), 
			toElem = ( opt.elem !== null && opt.elem.length );
		
		var easeout = function( x, t, b, c, d ) {
			return -c * t * t / ( d * d ) + 2 * c * t / d + b;
		};
		
		// Can't find the element
		if( !opt.elem || !opt.elem.length )
			return false;
		
		if( toElem ) {
			endpos = Math.round( opt.elem.offset().top );
		}
		
		if( endpos + opt.yOffset == st )
			return false;
		
		// Set the offset
		endpos = Math.floor( endpos + opt.yOffset );
		
		timerId = setInterval(function() {
			var t = (new Date()).getTime() - start, state = t / opt.duration,
				
				ratio = easeout( state, t, 0, 1, opt.duration );
				
			if( (new Date()).getTime() > ( start + opt.duration ) ) {
				
				clearInterval( timerId );
				timerId = null;
				
				$( window ).scrollTop( endpos );
			} else {
				var step = ( toElem ? ratio : ( 1 - ratio ) ) * ( endpos - st );
				
				$( window ).scrollTop( st + step );
			}
		}, 17 );
	};


});