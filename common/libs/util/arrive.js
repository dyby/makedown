/**
 * 动画包
 * 移动函数
 *  
 */
define( 'arrive', function( require, exports ) {
	
	var timers = [];

	var api = {};
	
	/**
	 * 移动到某坐标位置，间隔时间越短，移动速度越快
	 * 该函数不是在规定时间内完成
	 * 
	 * @param {target}
	 * @param {params} 要被操作的属性
	 *  
	 */
	api.start = function( target, params ) {
		
		$( target ).each(function() {
	
			api.stop( this );
			
			timers.push( new monitor( this, params ) );
		});
	};
	
	// 终止正在进行动画的元素
	api.stop = function( target ) {
	
		for( var i = 0; i < timers.length; i ++ ) {

			var fn = timers[i];
			
			if( fn.target === target ) {
				fn.stop();
				
				timers.splice( i, 1 );
			}
		}
	};
	

	function monitor( target, params ) {

		this.target = target;
		
		this.timer = null;
		
		// 可选项
		this.opt = {
			// 终点目标
			to 			: null,
			// 偏移量
			offset 		: [],
			// 间隔时间
			step 		: null,
			// 间隔执行时间
			delay		: 29,

			onStart		: function() {},
			onStep		: function() {},
			onComplete	: function() {}
		};
		
		$.extend( this.opt, params );
		
		this.init();
	}
	
	monitor.prototype = {
		
		// 设置参数
		init: function() {
			var _this = this;

			$( this.opt.to ).show();
			
			// 开始坐标
			this._start = {
				left: $( this.target ).position().left,
				top	: $( this.target ).position().top
			};
			
			// 设置变化量变化量
			this.setDiff();
			
			// 当前移动步长
			this._move_step = { 
				left: this.getStep().left, 
				top	: this.getStep().top
			};
			
			// 当前移动值
			this._cur = {
				left: this._start.left, top: this._start.top
			};

			this.opt.onStart.call( this, this.target, $( this.target ).position().left, $( this.target ).position().top );
			
			this.timer = setInterval(function() { _this.tick() }, this.opt.delay );
		},
		
		// 获取 x, y 轴上移动的步长
		getStep: function() {
			var left = 0, top = 0;

			this.setDiff();
			
			if( Math.abs( this._diff.left ) > Math.abs( this._diff.top ) ) {
				left = this.opt.step * this.getDir( this._diff.left );
				top = Math.abs( this._end.top - this._start.top ) * this.opt.step / Math.abs( this._end.left - this._start.left ) * this.getDir( this._diff.top );
			} else {
				left = Math.abs( this._end.left- this._start.left ) * this.opt.step / Math.abs( this._end.top - this._start.top ) * this.getDir( this._diff.left );
				top = this.opt.step * this.getDir( this._diff.top );
			}
			
			return {
				left: left, top: top
			}
		},
		
		// 获取移动方向
		// -1 表示往坐标轴更小的方向移动
		getDir: function( p ) {
			return ( p < 0 ? -1 : 1 );
		},

		setDiff: function() {
			this._end = {
				left: $( this.opt.to ).position().left,
				top : $( this.opt.to ).position().top
			};

			this._diff = {
				left: this._end.left - this._start.left,
				top	: this._end.top - this._start.top
			};
		},
		
		// 开始进行动画监听
		tick: function() {

			this.setDiff();

			this._cur.left += this._move_step.left;
			this._cur.top += this._move_step.top;
			
			if( Math.abs( this._cur.left - this._start.left ) < Math.abs( this._diff.left ) ) {
				
				$( this.target ).css( 'left', this._cur.left + 'px' );
				$( this.target ).css( 'top', this._cur.top + 'px' );
				
				this.opt.onStep.call( this, this.target, $( this.target ).position().left, $( this.target ).position().top );
			} 
			// 完成后回调，同时修正最终值
			else {
				this.fix();
				
				this.stop();
			}
			
		},
		
		stop: function() {
			clearInterval( this.timer );

			this.opt.onComplete.call( this, this.target, $( this.target ).position().left, $( this.target ).position().top );
		},
		
		// 修正到终点位置
		fix: function() {

			$( this.target ).css( 'left', $( this.opt.to ).position().left + 'px' );
			$( this.target ).css( 'top', $( this.opt.to ).position().top + 'px' );
		}
	};
	
	
	return api;
	
});