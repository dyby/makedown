/**
 * === UI ===
 *
 * 元素拖拽组件
 * 
 */

define( 'drag', [ 'event' ], function( require, exports ) {
	
	var E = require( 'event' );
	
	var drag = function( target, options ) {
		this.dragger = target;
		
		this.opt = {
			// 实际要移动的元素
			// 如果使用该参数，target 参数只提供拖拽功能，实际改变位置的元素为该元素
			mover		: null,
			
			range		: null,
			
			xLocked		: false,
			yLocked		: false,
			
			// 是否超出范围的部分 样式上 隐藏掉
			outHidden	: true,
			
			onStart		: function() {},
			// 修改指针环境为当前 drag 环境，返回两个参数当前 left, top 的相对位移
			onStep		: function() {}
		};
		
		$.extend( this.opt, options );
		
		this.Init();
	};
	
	drag.prototype = {
		name: 'pack_drag',
		
		Init: function() {
			// 进行移动的始终为 mover 这个对象
			// dragger 对象只提供事件
			this.mover = $( this.opt.mover || this.dragger );
			
			this.SetRange();
			
			this.mover.addClass( this.name + '_mover' ).css( 'position', 'absolute' );
			
			$( this.dragger ).addClass( this.name + '_dragger' );
			
			this.Bind();
		},
		
		// 设置区间范围
		SetRange: function() {
			var rElem = $( this.opt.range );
			
			if( !this.opt.range || !rElem.length ) {
				return;
			}
			
			if( rElem.css( "position" ) ) {
				//rElem.css({ "overflow": "hidden" });
			} else {
				rElem.css({ "position": "relative"/*, "overflow": "hidden"*/ });
			}
			
			if( this.opt.outHidden ) {
				rElem.css({ "overflow": "hidden" });
			}
			
			this._range = {
				x: [ 0, rElem.innerWidth() ],
				y: [ 0, rElem.innerHeight() ]
			};
		},
		
		// 绑定拖拽事件，获取拖拽的间隔时间，之后调用移动方法
		Bind: function() {
			var _this = this;
			
			this._startHandler = function( event, target ) {
				// 屏蔽右键
				if( event.button === 2 ) {
					return;
				}
				
				return _this.DragStart( event, target );
			};
			this._stopHandler = function( event, target ) {
				return _this.DragStop();
			};
			this._folowHandler = function( event, target ) {
				return _this.Follow( event, target );
			};
			
			this._bind = function() {
				$( document ).bind( 'mouseup.' + _this.name, function( event, target ) { _this._stopHandler( event, target ) });
				$( document ).bind( 'mousemove.' + _this.name, function( event, target ) { _this._folowHandler( event, target ) });
			};
			this._unbind = function() {
				$( document ).unbind( 'mouseup.' + _this.name );
				$( document ).unbind( 'mousemove.' + _this.name );
			};
			
			// Dragger event
			$( this.dragger ).bind( 'mousedown.' + this.name, function( event, target ) {
				_this._startHandler( event, target );
				
				this.onselectstart = function() { return false; };
				return false;
			});
			
			
			// PUBLIC API
			// 为该元素提供外部控制接口
			// 直接为该元素属性附加接口方法
			this.dragger.__DRAG = {
				STOP: function() {
					_this.DragStop();
				}
			};
		},
		
		// 事件开启
		DragStart: function( event, target ) {
			//this._stop = false;
			
			// 记录点击时鼠标位置
			this.mousePoint = {
				left: E.x( event ), 
				top	: E.y( event )
			};
				
			// 记录点击时位移元素相对位置
			this.startPoint = {
				left: this.mover.position().left, 
				top	: this.mover.position().top
			};
			
			this.mover.removeClass( this.name + '_drag_move' + ' ' + this.name + '_drag_stop' );
			this.mover.addClass( this.name + '_drag_start' );
			
			this._bind();
			
			this.opt.onStart.call( this.mover[0], this.startPoint.left, this.startPoint.top, $( this.opt.range ) );
		},
		
		// 事件关闭
		DragStop: function() {
			
			this.mover.removeClass( this.name + '_drag_start' + ' ' + this.name + '_drag_move' );
			this.mover.addClass( this.name + '_drag_stop' );
			
			this._unbind();
		},
		
		// 元素跟随鼠标进行移动
		Follow: function( event, target ) {
			this.mover.removeClass( this.name + '_drag_start' );
			this.mover.addClass( this.name + '_drag_move' );
			
			var step = this.GetMoveStep( event );
			
			// 如果存在范围则对 step 进行修正
			step = this.StepFix( step );
			
			this.mover.css( step );
			
			this.OnStepHandler();
		},
		
		// 如果存在范围则对 step 进行修正
		StepFix: function( step ) {
			var rElem = $( this.opt.range ), w = this.mover.outerWidth( true ), h = this.mover.outerHeight( true );
			
			if( !this.opt.range || !rElem.length ) {
				return step;
			}
			
			// 拖动的元素横向实际尺寸大于范围尺寸
			if( this._range.x[0] + this._range.x[1] < w ) {
				this._xSmall = true;
			} else {
				this._xSmall = false;
			}
			
			// 拖动的元素横向实际尺寸大于范围尺寸
			if( this._range.y[0] + this._range.y[1] < h ) {
				this._ySmall = true;
			} else {
				this._ySmall = false;
			}
			
			// 横向上的修正
			if( !this._xSmall ) {
				// 左侧边界值
				if( step.left < this._range.x[0] ) {
					step.left = this._range.x[0];
				}
				// 右侧边界值
				if( step.left + w > this._range.x[1] ) {
					step.left = this._range.x[1] - w;
				}
			} 
			// 拖动的元素实际尺寸大于范围尺寸
			else {
				// 左侧边界值
				if( step.left > this._range.x[0] ) {
					step.left = this._range.x[0];
				}
				// 右侧侧边界值
				if( step.left < this._range.x[1] - w ) {
					step.left = this._range.x[1] - w;
				}
			}
			
			// 纵向上的修正
			if( !this._ySmall ) {
				// 顶部边界值
				if( step.top < this._range.y[0] ) {
					step.top = this._range.y[0]
				}
				// 底部边界值
				if( step.top + h > this._range.y[1] ) {
					step.top = this._range.y[1] - h;
				}
			} else {
				// 顶部边界值
				if( step.top > this._range.y[0] ) {
					step.top = this._range.y[0];
				}
				// 底部边界值
				if( step.top < this._range.y[1] - h ) {
					step.top = this._range.y[1] - h;
				}
			}
			
			
			return step;
		},
		
		// 获取当前位移
		GetMoveStep: function( event, objectArr ) {
			var step = {};
			
			if( !this.opt.xLocked ) {
				step.left = E.x( event ) - this.mousePoint.left + this.startPoint.left;
			}
			if( !this.opt.yLocked ) {
				step.top = E.y( event ) - this.mousePoint.top + this.startPoint.top;
			}
			
			return step;
		},
		
		// 移动步长的回调
		OnStepHandler: function() {
			
			this.opt.onStep.call(
				this.mover[0], 
				this.mover.position().left - this.startPoint.left || 0, 
				this.mover.position().top - this.startPoint.top || 0,
				$( this.opt.range )
			);
		}
	}
	
	return drag;
});