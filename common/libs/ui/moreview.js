define( 'moreview', function( require ) {
/*
 * 用于展示该图片的相关产品图片的通用接口
 * 
 * 需要调用base.imgLoader
 * 
 */
var _base = require( 'base' );

var moreview = function( elems, options ) {

	new moreviewMain( elems , options );

};

function moreviewMain( target, options ) {
	this.target = target;
	
	this.loading = false;
	
	this.opt = {
		// [target name] 按钮参数该元素的高宽
		onNode		: "li",
		// 图片加载中
		loading		: "loading",
		// 图片加载失败
		error		: "error",
		
		tipsLocked	: true,
		
		// 提示信息在y 轴上的偏移量
		yOffset		: 0,
		
		// 是否在点击切换图片按钮之后给当前图片的url 附加index 值
		updateHref	: true,
		
		isAnimate	: true,
		
		// 点击切换按钮之后，图片加载成功或者失败的回调
		onFinish	: function(){}
	};
	
	$.extend( this.opt, options );
	
	this.Init();
}

moreviewMain.prototype = {
	Init: function() {
			
		// #指向当前hover 元素，只有该元素存在的时候，控制层才会启用
		this.curHover = null;
		
		this.Print();
		
		this.Bind();
	},
	
	// 创建控制
	// #页面中只有一个控制
	Print: function() {
		if( $( "#s-moreview" ).length ) { 
			return;
		}
		
		var str = "\
					<div id='s-moreview' style='position:absolute;display:none;'>\
						<img id='s-moreview_aimg' style='position: absolute;display:none;' src='' />\
						<a id='s-moreview_prev' class='s-moreview_btns' href='javascript:void(0);'></a>\
						<a id='s-moreview_next' class='s-moreview_btns' href='javascript:void(0);'></a>\
						<span id='s-moreview_page' style='position:absolute;'>0 / 0</span>\
					</div>\
				";
		//<span id='s-moreview_loader' style='position:absolute;display:none;'></span>\
		$( "body" ).append( str );
		
		// 用于切换时进行动画
		this.animate_img = $( "#s-moreview_aimg" );
		
		this.bar = $( "#s-moreview" );
		this.prev = $( "#s-moreview_prev" );
		this.next = $( "#s-moreview_next" );
		//this.loader = $( "#s-moreview_loader" );
		this.page = $( "#s-moreview_page" );
	},
	
	// 绑定交互事件
	Bind: function() {
		
		var _this = this, elem = $( this.target );
		
		this._stimer = null;
		this._htimer = null;
		
		elem.find( this.opt.onNode ).hover(
			function( event ) { _this.ShowBar( this ); },
			function( event ) { _this.HideBar( this ); }
		);
		
		$.each( [ this.prev, this.next, this.page, this.animate_img ], function() {
			$( this ).hover(
				function( event ) { clearTimeout( _this._htimer ); },
				function( event ) { _this.HideBar(); }
			);
		});
		
		this.prev.click(function() {
			if( !_this.loading ) {
				_this.GetIMG( -1 );
			}
		});
		this.next.click(function() {
			if( !_this.loading ) {
				_this.GetIMG( 1 );
			}
		});
	},
	
	// 显示控制层
	ShowBar: function( target ) {
		var _this = this;
		
		clearTimeout( this._stimer );
		clearTimeout( this._htimer );
		
		this._stimer = setTimeout(function() {
		
			_this.curHover = target;
			// 设置控制层的位置
			_this.SetPosInfo();
		}, 200 );
	},
	
	// 隐藏控制层
	HideBar: function() {
		var _this = this;
		
		clearTimeout( this._stimer );
		clearTimeout( this._htimer );
		
		this._htimer = setTimeout(function() {
			_this.bar.fadeOut( 200 );
			
			_this.curHover = null;
		}, 200 );
	},
	
	// 设置控制层的位置
	SetPosInfo: function() {
		var elem = $( this.curHover );
		
		var data = this.GetData(), index = this.MatchIndex( data.curImg, data.arr );
		
		//this.bar.hide();
		
		if( data.arr.length < 2 ) {
			this.bar.hide();
			return false;
		}
		
		if( elem.outerWidth() !== 0 ) {
			
			this.bar.css({
				left	: elem.offset().left,
				top		: elem.offset().top + elem.outerHeight( true ),
				width	: elem.outerWidth(),
				height	: 0
			});
			
			this.prev.css({
				top: ( elem.outerHeight( true ) * -1 - this.prev.outerHeight( true ) ) * 0.5
			});
			this.next.css({
				top: ( elem.outerHeight( true ) * -1 - this.next.outerHeight( true ) ) * 0.5
			});
			
		}
		
		this.bar.show();
		
		this.page.text( ( index + 1 ) +" / "+ data.arr.length );
	},
	
	// 获取图片
	GetIMG: function( dir ) {
		if( this.curHover == null ) return;
		
		this.loading = true;
		
		var _this = this, data = this.GetData(), index = this.MatchIndex( data.curImg, data.arr ), 
			// 要进行展示图片列表的索引值
			getIndex = index + dir;
		
		if( getIndex < 0 ) {
			getIndex = data.arr.length - 1;
		}
		if( getIndex > data.arr.length - 1 ) {
			getIndex = 0;
		}
		
		var url = data.arr[ getIndex ];
		
		if( url ) {
			// 将图片先进行隐藏
			//$( data.curImg ).hide();
			this.loaderAnimate();
				
			this.Tips().loading();
			
			_base.imgLoader( url, function() {
				var _url = $( this ).attr( 'src' );

				$( data.curImg ).attr( "src", _url ).hide();
				
				$( data.curImg ).fadeIn( 200, function() {
					_this.SetPosInfo();
					
					_this.animate_img.attr( "src", url );
					_this.bar.fadeIn( 200 );
				});
				_this.Tips().success();
				
				_this.loading = false;
				
				_this.opt.onFinish( data.curImg, getIndex );
			});
			
		}
		
		// 修改目标图片的父级 超链接的 href
		if( this.opt.updateHref ) {
			this.UpdateHref( data.curImg, getIndex );
		}
	},
	
	// 获取数据
	// @Return
	//	arr: 图片列表集合
	//	curImg: 当前hover的图片元素
	GetData: function() {
		var curImg = null, arr = [], str = $( this.curHover ).attr( "list" );
		
		if( !str ) {
			
			$( this.curHover ).find( "img" ).each(function() {
				str = $( this ).attr( "list" );
				curImg = this;
			});
			
		} else {
			
			curImg = this.curHover;
		}

		arr = str === undefined ? [] : str.split( "," );
		
		return {
			arr: this.Unique( arr ), curImg: curImg
		}; 
	},
	
	// 匹配当前元素的url 地址在地址数组中的第几位
	MatchIndex: function( curImg, arr ) {
		var curSrc = $( curImg ).attr( "src" );
		
		for( var i = 0; i < arr.length; i ++ ) {
			var expr = new RegExp( arr[i] );
			
			if( expr.test( curSrc ) ) {
				return i;
			}
		}
		
		return -1;
	},
	
	// 去除数组重复项
	Unique: function( arr ) {
		var temp = [];
		
		for( var i = 0; i < arr.length; i ++ ) {
			var exist = false, compItem = arr[i];
			
			for( var j = 0; j < temp.length; j ++ ) {
				var newItem = temp[j];
				
				if( newItem === compItem ) {
					exist = true;
				}
			}
			
			if( !exist ) {
				temp.push( compItem );
			}
		}
		
		return temp;
	},
	
	// 修改当前hover 图片的父级链接的索引值
	UpdateHref: function( targetImg, index ) {
		var href = "", link = $( targetImg ).closest( "a" ), hrefArr = link.attr( "href" ).split( "?" );
		
		// 没有?
		if( !hrefArr[1] ) {
			href = hrefArr[0] + "?mv-index=" + index;
		} 
		// 有? 之后的参数
		else {
			// 不存在mv-index
			if( !/mv-index/.test( hrefArr[1] ) ) {
				var ptemp = []; params = hrefArr[1].split( "&" );
				
				for( var i = 0; i < params.length; i ++ ) {
					if( params[i] !== "" ) {
						ptemp.push( params[i] );
					}
				}
				
				hrefArr[1] = ptemp.join( "&" ) + "&mv-index=" + index;
			} 
			// 已经存在mv-index
			else {
				hrefArr[1] = hrefArr[1].replace( /mv-index=(\d+)/, function( w ) {
					return "mv-index=" + index;
				});
			}
			
			href = hrefArr[0] + "?" + hrefArr[1];
		}
		
		link.attr( "href", href );
		
	},
	
	loaderAnimate: function() {
		/*
		if( !this.opt.isAnimate ) return;
		
		var _this = this, elem = $( this.curHover ),
			curimg = this.GetData().curImg, cur_src = $( curimg ).attr( "src" ),
			aimg = this.animate_img, w = $( curimg ).width(), h = $( curimg ).height();
		
		aimg.attr( "src", cur_src );
		
		aimg.css({
			top		: elem.outerHeight( true ) * -1,
			left	: ( elem.outerWidth( true ) - w ) * 0.5,
			height	: elem.outerHeight( true )
		}).show();
		
		aimg.fadeOut( 400 );
		*/
	},
	
	// 图片进度控制
	Tips: function() {
		var _this = this;
		
		return {
			
			setPos: function() {
				var elem = $( _this.curHover );
				
				_this.loader
					.css({
						left	: elem.innerWidth() * 0.5 - _this.loader.innerWidth() * 0.5,
						top		: elem.innerHeight() * 0.2 * -1 - _this.loader.innerHeight() * 0.5 + _this.opt.yOffset
					});
			},
		
			loading: function() {
				if( !_this.opt.tipsLocked ) {
					this.setPos();
					_this.loader.html( _this.opt.loading ).fadeIn( 60 );
				}
			},
			
			success: function() {
				if( !_this.opt.tipsLocked ) {
					this.setPos();
					_this.loader.fadeOut( 60 );
				}
			},
			
			error: function() {
				if( !_this.opt.tipsLocked ) {
					this.setPos();
					_this.loader.html( _this.opt.error ).fadeIn( 60 );
				}
			}
		
		}
	}
}

return moreview;

});