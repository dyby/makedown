/**
* 用于左侧树形菜单的
* 更新时间2013-09-02
* 作者:杨永宏
*
*/
define( 'simpleTree' ,function( require, exports, module ){
	// $.fn.simpleTree=function(options){
	// 	this.each( function() {
	// 		new simpleTree( this,options );
	// 	});

	// };

	var simpleTree = function( elem , opt ){
		this.elem = elem ;
		this.opt = {
			handler: ".title",//操作对象
			toggleClass: "title_selected",//class切换
			showtarget: "ul",//展示的子菜单对象
			currentClass: ".menu-list-current"//子菜单的选中状态
		};
		$.extend( this.opt , opt );

		this.init();
	};

	simpleTree.prototype = {
		init:function() {

			var elem = $( this.elem ); 
			var _this = this;

			elem.find( _this.opt.currentClass ).parents( _this.opt.showtarget ).show();
			
			elem.find( _this.opt.currentClass ).parents( _this.opt.showtarget ).prev().find( _this.opt.handler ).addClass( _this.opt.toggleClass );
			
			this.bind();
		},
		//绑定点击事件
		bind:function(){

			var elem = $( this.elem );
			var _this = this;

			elem.find( _this.opt.handler ).bind( "click" , function(){
				_this.animate();
			});
		},
		//点击时要执行的动作
		animate:function(){

			var elem = $( this.elem ); 
			var _this = this;
			var _title = elem.find( _this.opt.handler );

			if( _title.hasClass( _this.opt.toggleClass ) ) {

				_title.removeClass( _this.opt.toggleClass );

			}else{

				_title.addClass( _this.opt.toggleClass );

			}

			_title.parents().find( elem.find( _this.opt.showtarget ) ).animate({

				"height": "toggle"

			}, 100 );

		}
	};
	return simpleTree;
});