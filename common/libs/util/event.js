/**
 * === BASE ===
 
 * 事件库
 * 
 */

define( 'event', function( require, exports ) {

	var api = {};


	/*
	 * 事件中转功能
	 *
	 */
	api.transit = function( target, options ) {

		$( target ).each(function() {

			new transit( this, options );
		});
	};


	var transit_tick_timer = null, transit_timers = [];

	function transit( target, options ) {
		
		this.target = target;
		
		this.opt = {
			pauseGroup	: null,
			onOver		: function() {},
			onOut		: function() {}
		};
		
		$.extend( this.opt, options );
		
		this.init();
	}

	transit.prototype = {
		
		init: function() {
			
			var _this = this, target = this.target;
			
			// 用户行为触发
			target.onTrigger = function() {
				clearInterval( this.timer );
				clearTimeout( this.outTimer );
				
				this._triggered = true;
				
				this._onOver.call( _this, this );
			};
			
			this.bind();
		},
		
		// 绑定事件
		bind: function() {
			var _this = this;
			
			// 记录器开始
			$( this.target ).bind( "mouseover.transit", function( event ) { _this.onStart( this, event ); });
			
			// 更新移动坐标
			$( this.target ).bind( "mousemove.transit", function( event ) { _this.onProcess( event ); });
			
			// 判断是否最终移出元素
			$( this.target ).bind( "mouseout.transit", function( event ) { _this.onStop(); });
			
		},
		
		// 这类元素mouseover 的时候不执行target 的out 回调
		bindGroup: function( target ) {
			var _this = this, group = this.opt.pauseGroup;
			
			if( !group || !group.length ) {
				return;
			}
			
			group.unbind( "mouseover.transit" ).bind( "mouseover.transit", function( event ) {
				clearTimeout( _this.current.outTimer );
			});
			
			group.unbind( "mouseout.transit" ).bind( "mouseout.transit", function( event ) {
				_this.onStop();
			});
		},
		
		onStart: function( target, event ) {
			var _this = this;
			
			target._onOver 	= this.opt.onOver;
			target._onOut 	= this.opt.onOut;
			
			this.current 	= target;
			// 这个初始值只是搞哈笑而已
			this.coorArr 	= [ 0.123456, 0.654321 ];
			
			// 清除该元素原始的计时器
			this.clear();
			
			// 开始一个监听器
			// 用于检测最后一次触发该函数之后某时间内，是否timer 还有在执行的
			// 3秒后，直接清理所有计时器，避免程序bug出现的计时器一直运行造成的内存泄露问题
			this.tick();
			
			// 当从group 中重新出发 target 的时候清除out 的timer
			clearTimeout( _this.current.outTimer );
			
			this.bindGroup( target );
			
			transit_timers.push( this.current );
			
			// 计时器开始进行判断用户鼠标行为
			this.current.timer = setInterval(function() {
				_this.coorArr.push( _this.coor );
				_this.compareCoor();
			}, 23 );
		},
		
		// 每次在元素上移动都更新当前鼠标位置
		onProcess: function( event ) {
			this.coor = [ event.pageX, event.pageY ];
		},
		
		onStop: function() {
			var _this = this;
			
			this.clear();
			
			if( !this.current || !$( this.current ).length ) { return false; }
			
			clearTimeout( this.current.outTimer );
			
			this.current.outTimer = setTimeout(function() {
				
				// 只有当触发了 trigger 之后才会进行关闭的回调
				if( _this.current._triggered ) {
					
					_this.current._onOut.call( _this, _this.current );
					
					// 完成回调之后，重置该值
					_this.current._triggered = false;
				}
			}, 24 );
		},
		
		// 对比坐标
		compareCoor: function() {
			var arr = this.coorArr, len = arr.length,
				lastCoor = arr[ len - 1 ], prevCoor = arr[ len - 2 ];
			
			if( lastCoor[0] == prevCoor[0] && lastCoor[1] == prevCoor[1] ) {
				
				this.current.onTrigger();
			}
		},
		
		// 从计时器队列中清除当前out 元素的计时器
		clear: function() {
			for( var i = 0; i < transit_timers.length; i ++ ) {
				var target = transit_timers[i];
				
				if( target === this.current ) {
					clearInterval( this.current.timer );
					transit_timers.splice( i, 1 );
				}
			}
		},
		
		// timer 监视器
		tick: function() {
			clearTimeout( transit_tick_timer );
			
			transit_tick_timer = setTimeout(function() {
				
				if( transit_timers.length ) {
					for( var i = 0; i < transit_timers.length; i ++ ) {
						var target = transit_timers[i];
						
						clearInterval( target.timer );
						transit_timers.splice( i, 1 );
					}
				}
			}, 3000 );
		}
	};

	
	return api;
});