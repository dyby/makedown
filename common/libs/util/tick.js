/**
 * 使用时间作为间隔的计时器，用于执行设定了完成时间的计时器
 *  
 */
define( 'tick', [ 'base' ], function( require, exports ) {
	
	var B = require( 'base' );
	

	var api = {
	
		timers: [],
		
		// 时间依据的计时器
		start: function( target, options ) {
			
			$( target ).each(function() {

				var fn = api.isExist( this );

				// 队列中没有该元素
				if( !fn ) {
					api.timers.push( new tick( this, options ) );
				} 
				// 暂停的元素重新在队列中开始
				else { 
					// Do something
					fn.onPlay();
				}
			});
		},
		
		// 判断是否在数组中
		isExist: function( target, func ) {
			
			for( var i = 0; i < this.timers.length; i ++ ) {
				var fn = this.timers[i];
				
				if( target === fn.target ) {
					// 是否执行回调
					if( func && $.isFunction( func ) ) { func( i, fn ); }
					
					return fn;
				}
			}
		},

		// 暂停
		pause: function( target ) {

			$( target ).each(function() {
				api.isExist( this, function( index, fn ) {
					clearInterval( fn.timer );
				});
			});
		},
		
		// 停止元素的某个计时器，并且从队列中移除
		stop: function( target ) {
			
			$( target ).each(function() {
			
				api.isExist( this, function( index, fn ) {
					
					clearInterval( fn.timer );
					fn.timer = null;
					
					api.timers.splice( index, 1 );
				});
			});
		},
		
		// 清空所有执行的监听
		clear: function() {
			for( var i = 0; i < this.timers.length; i ++ ) {
				clearInterval( this.timers[i].timer );
				this.timers[i].timer = null;
				
				this.timers.splice( i, 1 );
			}
		}
	};
	
	// 监听器
	function tick( target, options ) {
		var _this = this;
		
		this.target = target;
		this.start = B.now();
		this.timer = null;
		
		this.opt = {
			delay		: 1000,
			duration	: null,
			onStart		: function() {},
			onStep		: function() {},
			onComplete	: function() {}
		};

		this.__i = 0;
		
		$.extend( this.opt, options );
		
		// 停止某元素的计时器
		this.onStop = function() {
			api.stop( _this.target );
			
			_this.opt.onComplete.call( _this.target );
		};

		this.onPlay = function() {

			_this.__i = 0;

			clearInterval( _this.timer );

			// 计时器开始
			_this.opt.onStart.call( _this.target );

			//var first_diff = B.now() - _this.start;
			//_this.opt.onStep.call( _this.target, first_diff, B.math.float( first_diff / ( _this.opt.duration || _this.opt.delay ) ) );

			_this.timer = setInterval(function() {
				var diff = B.now() - _this.start;
				
				if( _this.opt.duration !== null && diff >= _this.opt.duration ) { 
					_this.onStop(); 
				}
				
				_this.opt.onStep.call( _this.target, diff, B.math.float( diff / ( _this.opt.duration || _this.opt.delay ) ) );
				
			}, _this.opt.delay );
		};


		this.onPlay();
		
	}
	
	
	return api;
	
});