/**
 * 页面模块加载配置
 *
 */
define(function( require, exports, module ) {
	/**
	 * 引入包 
	 */
	_Masonry = require( 'ui.masonry' );

	$(function(){
		new _Masonry( $('.relist')[0], 'dl', {
			colnum : 2
		});
	});

});