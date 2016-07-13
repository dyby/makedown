/*
 * Deo 瀑布流
 *
 */
define( 'ui.masonry', [ 'base' ], function( require, exports ) {
	
	//var _Base = require( 'base' );
	
	function masonry( box, items, options ) {

	 	this.opt = {
	 		colnum	: 3,
	 		onFinished: function() {}
	 	};

	 	$.extend( this.opt, options );

	 	this.box 	= box;
	 	this.items 	= $( box ).find( items );

	 	this._item_w = 0;

	 	this.init();
	 }

	 masonry.prototype = {

	 	init: function() {
	 		var _this = this;

	 		this.items.each(function( i ) {

	 			// 取一个最大的
	 			if( $( this ).outerWidth( true ) > _this._item_w ) {
	 				_this._item_w = $( this ).outerWidth( true );
	 			}

	 			this._i = i;
	 			this._ri = Math.floor( i / _this.opt.colnum );
	 			this._height = $( this ).outerHeight( true );
	 		});

	 		// js 创建一个包裹层
	 		$( this.box ).wrapInner( '<div class="masonry_wrap" style="position:relative;"></div>' );

	 		this.sort();
	 	},

	 	sort: function() {
	 		var _this = this;

	 		this._wrap = $( this.box ).find( '.masonry_wrap' );

	 		// 优先设置宽度
	 		this._wrap.css( 'width', ( this._item_w * this.opt.colnum ) + 'px' );

	 		this.items.css({ position: 'absolute', 'left': 0, 'top': 0 });
 			
 			// 内部项的排序
	 		this.items.each(function( i ) {

	 			// 第一行的不获取最小行高位置
	 			if( this._ri == 0 ) {
	 				$( this ).css( 'left', i * _this._item_w );
	 				return;
	 			}

 				var min_target = _this.getColMin( this );

				if( min_target ) {

					$( this ).css({
						'left': $( min_target ).position().left,
						'top' : $( min_target ).position().top + min_target._height
					});
				}
	 		});

	 		this.setWrapHeight();

	 	},

	 	// 获取竖行中最小高度位置
	 	getColMin: function( target ) {

	 		var _this = this, data = {};

	 		this.items.each(function( i ) {

	 			if( i < target._i ) {

	 				// 列索引
	 				var col_i = $( this ).position().left / _this._item_w, b = $( this ).position().top + this._height;

		 			if( data[col_i] == undefined ) {

		 				data[col_i] = { target: null, height: 0 };
		 			}

		 			data[col_i] = { target: this, height: data[col_i].height + b };
	 			}
	 		});

	 		var min = 999999, temp = null;

	 		for( var k in data ) {
	 			if( data[k].height < min ) {
	 				min = data[k].height;
	 				temp = data[k].target;
	 			}
	 		}

	 		return temp;
	 	},

	 	// 设置包裹层的最大高度
	 	setWrapHeight: function() {

	 		var h = 0;

	 		this.items.each(function() {
	 			var b = $( this ).position().top + this._height;

	 			if( b > h ) {
	 				h = b;
	 			}
	 		});

	 		this._wrap.css( 'height', h );

	 		this.opt.onFinished();
	 	}
	 };


	 return masonry;
	
});