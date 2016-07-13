/*
 * Create a cover element for element
 *
 */
define( 'ui.cover', function( require, exports, module ) {


	var api = {};

	var elems = {
		cover 	: null,
		main	: null,
		content	: null,
		items	: null,
		close	: null
	};

	// 记录原始位置以及 元素
	var store = {
		pos : null,
		elem: null
	};

	// 打开弹出窗
	api.open = function( cont_elem, options ) {
		
		var opt = {
			coverOn: null
		};

		var $cont = $( cont_elem );
		
		$.extend( opt, options );

		if( !$( '#jc-cover-shadow' ).length ) {
			$( 'body' ).append( '\
				<div id="jc-cover-shadow" class="jc-cover-items" style="display:none;"></div>\
				<div id="jc-cover-main" class="jc-cover-items" style="display:none;">\
					<div id="jc-cover-close"></div>\
					<div id="jc-cover-content"></div>\
				</div>\
				'
			);

			elems.cover = $( '#jc-cover-shadow' );
			elems.main = $( '#jc-cover-main' );
			elems.content = $( '#jc-cover-content' );
			elems.close = $( '#jc-cover-close' );
			elems.items = $( '.jc-cover-items' );


			elems.close.click(function() { close(); });

			elems.cover.click(function() { close(); });
		}

		var l = ( opt.coverOn == null ? 0 : $( opt.coverOn ).offset().left ),
			t = ( opt.coverOn == null ? 0 : $( opt.coverOn ).offset().top ),
			w = ( opt.coverOn == null ? $( window ).width() : $( opt.coverOn ).outerWidth() ),
			h = ( opt.coverOn == null ? $( window ).height() : $( opt.coverOn ).outerHeight() );

		// 遮罩层样式设置
		elems.cover.css({
			'width'	: w,
			'height': h,
			'left'	: l,
			'top'	: t
		});

		// 内容外层容器样式设置
		elems.main.css({
			'width' : $cont.outerWidth(),
			'height': $cont.outerHeight(),
			'left'	: ( w - $cont.outerWidth() ) * 0.5 + l,
			'top'	: ( h - $cont.outerHeight() ) * 0.5 + t
		});

		// 记录原始位置, 用于关闭之后放回原始位置
		store.pos = $cont.parent();
		store.elem = $cont;

		elems.content.html( $cont.show() );

		if( opt.coverOn == null ) {
			// 设置body 的样式
			$( 'body' ).css({ 'height': h, 'overflow': 'hidden' });
			elems.items.css( 'position', 'fixed' );
		} else {
			elems.items.css( 'position', 'absolute' );
		}

		elems.items.fadeIn( 100 );
	};

	// 关闭弹出窗
	var close = api.close = function() {

		if( elems.items && elems.items.length ) {
			$( 'body' ).css({ 'height': 'auto', 'overflow': 'auto' });

			elems.items.fadeOut( 100 );
			store.pos.append( store.elem.hide() );
		}
	};

	return api;

});