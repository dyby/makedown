


define(function( require, exports, module ) {

	/**
	 * 引入包 
	 */
	var _Base = require( 'base' ),
		_Main = require( 'main' ),
		_Form = require( 'ui.form' ),
		_Vali = require( 'vali' ),
		_Jchecked = require( 'jchecked' );
	
	
	$(function() {

		_Form.validateNumber();

		/**
		 * 加载私人裁缝
		 */

		$('.jchecked').each(function() {
			new _Jchecked( this );
		});

		 _Main.ptailor.page = 'cart';

		_Main.ptailor.popper( "#s-ptailor_checkbox" );
		_Main.ptailor.bind( "#s-addtobag" );

		// 调用抠洞添加价格函数
		_Main.ptailor.dighole( "#s-pri_dighole" );

		// 调用定制函数
		_Main.ptailor.cussize( "#s-size", "#s-pri_cussize" );

		// 定制尺码部分，限定输入的值在可输入范围内(如果范围存在)
		_Main.ptailor.inrange( "#s-ptailor", $( '.costumer_units' ).find( 'input[type="radio"]' ), false );
		
        /*
         * 主商品提交按钮
         *
         */

		if( _params.pro_active ) {
		        	
        	var _Vali = require( 'vali' );
        	
        	$( '#s-addtobag' ).click(function() {
				
				if( !_Vali.lockedProductSubmit() && _Vali.checkKnum() && _Vali.checkCartPtailor() ) {
					
					_Form.submit.lock( $( '#s-addtobag' )[0], _lang.loading );
					
					$( '#cartform' ).submit();
					
					// 调用父级页面的方法刷新页面
					// php 跳转到一个页面，页面直接执行 iframeClosePopWindow
				}
	
				return false;
			});
		}
        
		
	});
	
	
});