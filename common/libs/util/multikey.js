/**
 * 模拟多个按键 keydown的时候，可以同时触发 [使用 setInterval ]
 * 
 * 执行间隔 13ms
 * keyup 的时候清除该按键的计时器
 * 
 *  
 */
define( 'multikey', function( require ) {
	
	var // 计时器队列
		timers = [];
	
	
	// 判断是否已经在 timers 数组中
	var inArray = function( key, func ) {
		for( var i = 0; i < timers.length; i ++ ) {
				
			var fn = timers[i];
			if( fn.key == key ) {
				func( i, fn ); return;
			}
		}
		
		func( null ); return;
	};
	
	// 监听器
	var tick = function( key, func ) {
		var _this = this;
		
		this.key 	= key;
		this.timer 	= null;
		this.func 	= func;
		
		this.timer = setInterval(function() {
			_this.func.call( _this, _this.key );
		}, multikey.delay );
	};
	
	// 停止某个在执行的键盘计时器
	var stop = function( key ) {
		
		inArray( key, function( index, fn ) {
			
			if( fn && fn.timer ) {
				clearInterval( fn.timer );
				fn.timer = null;
				
				timers.splice( index, 1 );
			}
		});
	};
	
	// 要提供的API 接口
	var multikey = {
		
		// 该功能允许使用的按键列表
		_allow: [
			// up
			87,
			// right
			68,
			// down
			83,
			// left
			65
		],
		
		// 每间隔 [ delay ]ms 进行一次返回
		delay: 37,
		
		init: function( options ) {
		
			// 启动计时器
			$( window ).keydown(function( event ) {
				
				if( $.inArray( event.keyCode ) ) {
					
					// 判断该键是否已经按下，并且存在于队列中
					inArray( event.keyCode, function( index, fn ) {
						
						// 添加到监听事件中
						if( index == null ) {
							
							// 创建计时器
							timers.push( new tick(
								event.keyCode,
								options.step || function() {},
								options.complete ||  function() {}
							));
						}
					});
				}
			});
			
			// 清除计时器
			$( window ).keyup(function( event ) {
				
				if( $.inArray( event.keyCode ) ) {
					stop( event.keyCode );
				}
			});
		}
	};
	
	return multikey;
	
});