define( 'domsearch' ,function( require, exports, module ){
/**
 * 快捷搜索
 * 对原始dom 进行显示隐藏操作
 * 
 * dataSource: 数据源的父级是需要被隐藏的元素，所以如果隐藏的位置和数据位置不是同一个元素，则需要指定
 *  
 * @param {Object} options
 */

// $.fn.domsearch = function( options ) {
// 	this.each(function() {
// 		new domsearch( this, options );
// 	});
// }

var domsearch = function( target, options ) {
	this.target = target;
	
	this.opt = {
		// 元素集合, 用于隐藏显示
		dataItem	: null,
		// 元素集合下的对应要查找的数据源对象选择器
		// 1: tagname || selector[.class || #id]
		// 2: @attr
		dataSource	: null,
		
		// 自动创建模糊快速数据
		autoQuick	: true
	};
	
	$.extend( this.opt, options );
	
	this.init();
}

domsearch.prototype = {
	
	init: function() {
		var _this = this;
		
		if( this.opt.autoQuick ) {
			this.createQuick();
		}
		
		$( this.target ).keyup(function() {
			
			var arr = _this.getMatch( $.trim( $( this ).val() ) );
			
			_this.reload( arr );
		});
	},
	
	// 自动创建一个快速搜索
	createQuick: function() {
		var _this = this;
		
		$( this.opt.dataItem ).each(function() {
			var elem = _this.getDataFrom( this ), text = _this.getText( elem );
			
			if( text.length && typeof text === 'string' ) {
				var qstr = '', arr = text.split( /\s/ );
				
				for( var i = 0; i < arr.length; i ++ ) {
					qstr += arr[i].charAt( 0 );
				}
				
				elem.attr( 'dom-search-autoquick', qstr );
			}
		});
	},
	
	// 匹配相似数据
	getMatch: function( val ) {
		var _this = this, match_arr = [], expr = new RegExp( '^'+ val, 'i' );
		
		$( this.opt.dataItem ).each(function() {
			var elem = _this.getDataFrom( this );
			
			if( // 从text 中进行开头全字匹配
				expr.test( _this.getText( elem ) ) || 
				// 快速匹配
				expr.test( elem.attr( 'dom-search-autoquick' ) ) 
			) {
				match_arr.push( this );
			}
		});
		
		return match_arr;
	},
	
	// 从指定位置获取元素
	getDataFrom: function( target ) {
		var ds = this.opt.dataSource;
		
		if( ds ) {
			return /^@/.test( ds ) ? $( target ) : $( target ).find( ds );
		} else {
			return $( target );
		}
	},
	
	getText: function( elem ) {
		var ds = this.opt.dataSource;
		
		return /^@/.test( ds ) ? elem.attr( ds.replace( /^@/, '' ) ) : elem.text();
	},
	
	// 重载 dom，隐藏不匹配的项
	reload: function( arr ) {
		$( this.opt.dataItem ).not( arr ).hide();
		$( this.opt.dataItem ).filter( arr ).show();
	}
}

return domsearch;

});
