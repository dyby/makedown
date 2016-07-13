


define(function( require, exports, module ) {

	/**
	 * 引入包 
	 */
	var _Base = require( 'base' ),
		_Droll = require( 'droll' ),
		_Event = require( 'event' ),
		_Ntab = require( 'ntab' ),
		_GetAddthis = require( 'getAddthis' ),
		_Form = require( 'ui.form' ),
		_Main = require( 'main' ),
		_Vali = require( 'vali' );


	/**
	 * 加载 fancybox 插件
	 */
	require( 'fancybox' );
    require( 'validate' );
	require( 'cloudzoom' );
	require( 'timedown' );
	require( 'favorite' );
	

	$( window ).load(function() {
		// sns
		new _GetAddthis( $( '.epaddthis' ) );
	});
	
	$(function() {

		// 计时器
		if( $( '#s_timedown' ).length ) {
			
			$( '#s_timedown' ).timeDown({
				runTime		: _params.time_end,
				startTime	: _params.time_start,
				daysText	: _lang.days
			});
		}


		if( $( '.custom_table' ).length ) {
			$( '.custom_table' ).find( 'input.required' ).focus(function() {
				$( this ).next().fadeIn( 100 );
			}).blur(function() {
				$( this ).next().fadeOut( 100 );
			});
		}


		_Form.validateNumber();


		$( '.s_quick_link' ).click(function() {
			var cur = $( this ).attr( 'href' );

			var match = null;

			$( '.s_tabs' ).find( 'a' ).each(function() {
				var to = $( this ).attr( 'href' );

				if( to == cur ) {
					$( this ).triggerHandler( 'click' );
					_Base.goto({ elem: $( '.s_tabs' ) });
				}
			});

			return false;
		});


		// 打包商品
		_Main.apfunc( $( '.s_pack_goods' ), '#s_combo_box' );


		//_Proshow({ isHD: _params.isHD });

		if( $( '#s_imglist' ).find( 'li' ).length > 5 ) {

			// 大图滚动功能
			new _Droll( $( '#s_imglist' )[0] , {

				step: 100, moveNum: 5, index: 0, loop: false,

				isHori: false,

				onBeforeInView: function( list ) {
					_Base.handLazy( list );
				}
			});
		}



		// 用于弹出层中的图片左右切换
		var zoom_index = 0, zoom_arr = [], small_img_arr = [];

		// 播放视频
		function videoPlay( videoUrl ) {
			
			var flashvars = {
				file: videoUrl,
				autostart: true,
				controlbar: "none"
			};
			var params = {
				wmode: "transparent"
			};
			
			swfobject.embedSWF(
				"http://v.mlo.me/swf/player.swf", "myvideo_place", "375", "500", "9.0.0", false, flashvars, params
			);
		}

		$( '#s_imglist' ).find( 'li > a' ).each(function() {

			if( $( this ).attr( 'video' ) ) {
				zoom_arr.push( null );
				small_img_arr.push( null );
			} else {
			 	// 高清图
				zoom_arr.push( 
					$( this ).attr( 'zoom-img' ) || $( this ).attr( 'href' )
				);

				// 缩略图
				small_img_arr.push( 
					$( this ).find( 'img' ).eq(0).attr( 'original' ) || $( this ).find( 'img' ).eq(0).attr( 'src' )
				);
			}

		}).click(function( event ) {

			$( this ).parent().addClass( 'pdo-droll_list_current' ).siblings().removeClass( 'pdo-droll_list_current' );


			// 播放视频
			if( $( this ).attr( 'video' ) ) {

				$( '#imgbox' ).hide();
				$( '#myvideo_place' ).show();

				videoPlay( $( this ).attr( 'video' ) );
			} 
			// 展示图片
			else {

				$( '#imgbox' ).show();
				$( '#myvideo_place' ).hide();

				var zoom_url = $( this ).attr( 'zoom-img' ), small_url = $( this ).attr( 'href' );

				// 如果有高清图，才绑定zoom 功能
				if( zoom_url ) {
					$( '#imgbox' ).html( '<a class="cloud-zoom" href="'+ zoom_url +'"><img src="'+ small_url +'" /></a>' );
					$( '.cloud-zoom' ).CloudZoom({ adjustX: 10, adjustY: 0, zoomWidth: 490, zoomHeight: 528, smoothMove: 6 });

					$( '#imgbox' )[0]._zoom = true;
				} 
				// 不绑定高清展示功能
				else {
					$( '#imgbox' ).html( '<a class="cloud-zoom" href="'+ small_url +'"><img src="'+ small_url +'" /></a>' );

					$( '#imgbox' )[0]._zoom = false;
				}
			}

			event.preventDefault();
		});

		// 打开第一张
		$( '#s_imglist' ).find( 'li > a' ).eq( zoom_index ).triggerHandler( 'click' );

		// {arr} 数组
		// {str} 当前要匹配的项
		function swtichImage( arr, str, dir, func ) {
			var idx = -1;

			for( var i = 0; i < arr.length; i ++ ) {
				var item = arr[i];

				if( item === str ) {
					idx = i;
					break;
				}
			}

			// 切换到第几个图片
			var go_i = idx + dir;

			if( go_i < 0 ) { go_i = arr.length - 1; }
			if( go_i > arr.length - 1 ) { go_i = 0; }

			return arr[ go_i ];
		}

		// 加载zoom 图片以及绑定相应函数
		function zoomLoadImage( url, func, targets ) {

			_Base.imgLoader( url, function() {

				// 图片的真实高宽
				var img_width = this.width, img_height = this.height, w, h, 

					view_h = $( window ).height() * 0.85;

				if( img_height > view_h ) {
					h = view_h;
					// w = h * img_width / img_height;
				} else {
					h = img_height;
					// w = img_width;
				}
				
				var _w = parseInt( w ) + 30 * 2;
				
				if( targets == 'stylist_ul_item'){

					var stylist_poper = $('.stylist-poper');

					if( !stylist_poper.length ) {

						// 弹出层中滚动栏
						var roll_html = [ '<div class="s_poper_imglist lazyload" style="height: '+ h +'px"><ul>' ];

						for( var i = 0; i < zoom_arrs.length; i ++ ) {
							if( zoom_arrs[i] == null ) {
								roll_html.push( '<li style="display:none;"><a></a></li>' );
							} else {
								roll_html.push( '<li><a href="'+ zoom_arrs[i] +'"><img src="'+ zoom_arrs[i] +'" /></a></li>' );
							}
						}

						roll_html.push( '</ul></div>' );

						$.fancybox( poper = $( '\
							<div class="stylist-poper" style="height: '+ h +'px;">\
								<!--<div class="zoom-poper-prev"><span></span></div>-->\
								<!--<div class="zoom-poper-next"><span></span></div>-->\
								<div class="zoom-poper-inner" style="height:'+h+'px;margin-right:15px;" >\
									<a  ><img  src="'+ url +'" /></a>\
								</div>\
								<div class="zoom-poper-roll">'+ roll_html.join( '' ) +'</div>\
							</div>\
						') );

						// 绑定缩略图点击功能
						$( '.s_poper_imglist' ).find( 'a' ).each(function(i) {
							this._i = i;
						}).click(function() {
							var $_url = $(this).attr('herf');
							$( this ).parent().addClass( 'pdo-droll_list_current' ).siblings().removeClass( 'pdo-droll_list_current' );
							$( '.stylist_ul_item' ).find( 'a' ).eq( this._i ).click();
							
							return false;
						});

						// 绑定 大图滚动功能
						new _Droll( $( '.s_poper_imglist' )[0] , {
							step: 100, moveNum: Math.floor( h / 100 ), index: 0, loop: false,isHori: false
						});
					} else {

						stylist_poper.find( '.zoom-poper-inner' ).html(
							'<a  ><img  src="'+ url +'" /></a>'
						);

					}

						var bar_w = $( '.zoom-poper-prev' ).outerWidth();

					// 设置外层宽度
					stylist_poper.css({
						'width'	: ( w + 86 ),
						'height': h
					});
					stylist_poper.find( '.zoom-poper-inner' ).css({
						'width'			: w,
						'height'		: h
					});
					stylist_poper.find( '.cloud-zoom-img' ).css( 'height', h +'px' );

					// 非高清切换时，调整弹出层大小以及弹出层位置
					$( '.fancybox-wrap' ).css({ 
						'width'	: $( '.fancybox-wrap' ).outerWidth() + ( w + bar_w * 2 ) - $( '.fancybox-inner' ).innerWidth()
					});

					$( '.fancybox-inner' ).css({
						'width'	: ( w + bar_w * 2 )
					});

					$( window ).triggerHandler( 'resize' );
				

					if( func ) { func() };
				}else{

				// 100 为每个缩略项的高度, 也即为步长
				var num = Math.floor( h / 100 );

				h = num * 100;

				// 加上2个滚动按钮的高度
				if( small_img_arr.length > num ) {
					h = h + 28;
				}

				w = h * img_width / img_height;

				var poper = $( '#zoom-poper' );

				if( !poper.length ) {

					// 弹出层中滚动栏
					var roll_html = [ '<div class="s_poper_imglist lazyload" style="height: '+ h +'px"><ul>' ];

					for( var i = 0; i < small_img_arr.length; i ++ ) {
						if( zoom_arr[i] == null ) {
							roll_html.push( '<li style="display:none;"><a></a></li>' );
						} else {
							roll_html.push( '<li><a href="'+ zoom_arr[i] +'"><img src="'+ small_img_arr[i] +'" /></a></li>' );
						}
					}

					roll_html.push( '</ul></div>' );

					$.fancybox( poper = $( '\
						<div id="zoom-poper" style="height: '+ h +'px;">\
							<!--div class="zoom-poper-prev"><span></span></div-->\
							<!--div class="zoom-poper-next"><span></span></div-->\
							<div class="zoom-poper-inner">\
								<a class="cloud-zoom" href="'+ url +'"><img class="cloud-zoom-img" src="'+ url +'" /></a>\
							</div>\
							<div class="zoom-poper-roll">'+ roll_html.join( '' ) +'</div>\
						</div>\
					') );


					// 绑定缩略图点击功能
					$( '.zoom-poper-roll' ).find( 'a' ).each(function(i) {
						this._i = i;
					}).click(function() {
						$( this ).parent().addClass( 'pdo-droll_list_current' ).siblings().removeClass( 'pdo-droll_list_current' );

						var _url = $( this ).attr( 'href' );
						
						$( '.zoom-poper-inner' ).html( '<a class="cloud-zoom" href="'+ _url +'"><img class="cloud-zoom-img" src="'+ _url +'" /></a>' );

						if( $( '#imgbox' )[0]._zoom ) {
							poper.find( '.cloud-zoom-img' ).css( 'height', h +'px' );
							poper.find( '.cloud-zoom' ).CloudZoom({ position: 'inside', smoothMove: 6 });
						}

						return false;
					});

					// 绑定 大图滚动功能
					new _Droll( $( '.s_poper_imglist' )[0] , {
						step: 100, moveNum: Math.floor( h / 100 ), index: 0, loop: false,isHori: false
					});

				} else {

					poper.find( '.zoom-poper-inner' ).html(
						'<a class="cloud-zoom" href="'+ url +'"><img class="cloud-zoom-img" src="'+ url +'" /></a>'
					);
				}
				
				var bar_w = $( '.zoom-poper-prev' ).outerWidth();

				// 设置外层宽度
				poper.css({
					// 'width'	: ( w + bar_w * 2 ),
					'width'	: ( w + 86 ),
					'height': h
				});

				poper.find( '.zoom-poper-inner' ).css({
					'width'			: w,
					'height'		: h,
					'margin-left'	: bar_w,
					'overflow'		: 'hidden'
				});

				poper.find( '.cloud-zoom-img' ).css( 'height', h +'px' );

				// 高清图才绑定该事件
				if( $( '#imgbox' )[0]._zoom ) {
					poper.find( '.cloud-zoom' ).CloudZoom({ position: 'inside', smoothMove: 6 });
				} else {
					poper.find( '.cloud-zoom' ).removeAttr( 'href' );

					// 非高清切换时，调整弹出层大小以及弹出层位置
					$( '.fancybox-wrap' ).css({ 
						'width'	: $( '.fancybox-wrap' ).outerWidth() + ( w + bar_w * 2 ) - $( '.fancybox-inner' ).innerWidth()
					});

					$( '.fancybox-inner' ).css({
						'width'	: ( w + bar_w * 2 )
					});

					$( window ).triggerHandler( 'resize' );
				}

				if( func ) { func() };
				}
			});
		}

		// 大图 zoom
		$( '#imgbox' ).click(function() {

			var zoom_url = $( this ).find( '.cloud-zoom' ).attr( 'href' );

			zoomLoadImage( zoom_url );
				
			// $( '.zoom-poper-prev' ).click(function() {
			// 	var url = $( '#zoom-poper' ).find( '.cloud-zoom-img' ).attr( 'src' ), s_url = swtichImage( zoom_arr, url, -1 );

			// 	zoomLoadImage( s_url );
			// });

			// $( '.zoom-poper-next' ).click(function() {
			// 	var url = $( '#zoom-poper' ).find( '.cloud-zoom-img' ).attr( 'src' ), s_url = swtichImage( zoom_arr, url, 1 );

			// 	zoomLoadImage( s_url );
			// });

			return false;
		});


		// 提示
		$( '.s_tips' ).each(function() {

			_Event.transit( this, {
				pauseGroup: $( $( this ).attr( 'open-elem' ) ),
				onOver: function( target ) {

					var open_elem = $( target ).attr( 'open-elem' );
					
					$( open_elem ).css({ 
						left: $( target ).offset().left - 10,
						top: $( target ).offset().top + $( target ).outerHeight( true )
					}).show();
				},
				onOut: function( target ) {
					var open_elem = $( target ).attr( 'open-elem' );
					$( open_elem ).hide();
				}
			});
		});

		
		/**
		 * 加载私人裁缝
		 */
		_Main.ptailor.popper( "#s-ptailor_checkbox", "#s-ptailor_edit", "#s-cancel_ptailor" );
		_Main.ptailor.bind( "#s-apply_ptailor", "#s-cancel_ptailor", "#s-ptailor_checkbox", "#s-ptailor_edit", ".s-fee_price" );
		// 调用切换定制参数与选择尺寸函数
		_Main.ptailor.switchType( ".s-size_part", ".s-size_choose", "#s-size", "#s-custom_type" );
		// 调用抠洞添加价格函数
		_Main.ptailor.dighole( "#s-pri_dighole" );
		// 调用定制函数
		_Main.ptailor.cussize( "#s-size", "#s-pri_cussize" );
		// 定制尺码部分，限定输入的值在可输入范围内(如果范围存在)
		_Main.ptailor.inrange( "#s-pri_cussize", $( '.costumer_units' ).find( 'input[type="radio"]' ), false );
		

		//tab切换
		$( ".s_tabs" ).each( function() {

	    	new _Ntab( this , {
		        currentClass: "current",
		        eventType: "click",
		        handler: "a"
	    	});
		});


		// 产品详情部分的展示
		$( '.s_goto' ).each(function() {

			this._top = $( this ).offset().top;

			var _list = $( this ).find( 'a' );

			$( this ).find( 'a' ).click(function() {

				_list.removeClass( 'current' );

				$( this ).addClass( 'current' );

				_Base.goto({
					elem: $( this ).attr( 'href' )
				});

			});
		});


		$( window ).scroll(function() {

			var goto = $( '.s_goto' );

			if( $( window ).scrollTop() > goto[0]._top ) {
				goto.addClass( 'fixed' );
			} else {
				goto.removeClass( 'fixed' );
			}
		});



		// also_bought 
		$( "#prodList" ).each( function() {

			new _Droll( this , {

				step: 150, moveNum: 5, index: 0, loop: false,

				onBeforeInView: function( list ){

					_Base.handLazy( list );
				}
			});

		});

		$( "#s_recommended , #s_recently" ).each( function() {
			new _Droll( this , {

				step: 153, moveNum: 6, index: 0, loop: true,

				onBeforeInView: function( list ) {

					_Base.handLazy( list );
				}
			});
		});

		
		$( '.fancybox' ).fancybox();
		
		$('.fb_group').fancybox({
            'transitionIn'	: 'elastic',
            'transitionOut'	: 'elastic',
            'loop'			: true,
            'titlePosition' : 'over',
            'titleFormat'   : function(title, currentArray, currentIndex, currentOpts) {
                return '<span id="fancybox-title-over">Image ' +  (currentIndex + 1) + ' / ' + currentArray.length + ' ' + title + '</span>';
            }
        });
        

        /*
         * 主商品提交按钮
         *
         */

		if( _params.pro_active ) {
        	
        	$( '#s-addtobag' ).click(function() {

				$( '#buytype' ).val(0);
				
				if( !_Vali.lockedProductSubmit() && _Vali.checkKnum() ) {
					
					_Form.submit.lock( $( '#s-addtobag' )[0], _lang.loading );
					$( '#cartform' ).submit();
				}
	
				return false;
			});
		}

		// 如果有打包商品
		var packBtn = $( '#package_addtobag' );

		if( packBtn.length ) {

			packBtn.click(function() {
				$( '#buytype' ).val(1);
				
				if( _Vali.lockedProductSubmit() || !_Vali.checkKnum() ) {
					_Base.goto({ elem: $( '#product_right' ) });
					return;
				}

				if( !_Vali.submitPackage() ) {
					return;
				}

				$( '#cartform' ).submit();
			});
		}


		// 验证
		$("#s_form_login").validate({
			messages: {
				loginusername: _lang.noname,
				loginuserpass: _lang.nopass
			},
			submitHandler: function( form ) {

				$( '#error_login' ).hide();

				_Form.ajaxSubmit( form, _params.logurl, {
					onError: function( msg ) {
						$( '#error_login' ).html( msg ).show();
					}
				});

				return false;
			}
		});

		$( "#s_form_reg" ).validate({
			messages: {
				email	 : _lang.noname,
				UserPass : _lang.nopass,
				UserPass2: _lang.nopass
			},
			submitHandler: function( form ) {

				$( '#error_reg' ).hide();

				_Form.ajaxSubmit( form, _params.regurl, {
					onError: function( msg ) {
						$( '#error_reg' ).html( msg ).show();
					}
				});

				return false;
			}
		});
        
        
        // 修改数量
		$( '#proqty' ).keyup(function() {

			_Main.getSales( _params.salesArr, _params.new_sale_price, this );
		});

		// 加减切换数量
		$( '.num_redu, .num_incr' ).click(function() {
			var n = _Base.math.float( $( '#proqty' ).val() );

			if( /num_redu/.test( $( this ).attr( 'class' ) ) ) {
				if( n == 1 || n == _params.knum ) {
					return;
				}

				$( '#proqty' ).val( n - 1 );
			}
			if( /num_incr/.test( $( this ).attr( 'class' ) ) ) {

				$( '#proqty' ).val( n + 1 );
			}

			$( '#proqty' ).triggerHandler( 'keyup' );
		});





		//設計師信息star

		if( $( '.stylist_ul_item' ).find( 'li' ).length >= 2 ) {

			// 大图滚动功能
			new _Droll( $( '.stylist_pic_box' )[0] , {

				listCurClass: '',
				step	: 224,
				moveNum	: 1,
				loop	: false,
				index	: 0 ,
				onBeforeInView: function( list ) {
					_Base.handLazy( list );
					var $all_num = $( list ).siblings().length + 1;
					var $curr_num = $( list ).index() + 1;
					var  $wrapper_num = ''+$curr_num+'/'+$all_num+'';

					if( !$('.pdo-droll-wrapper_num')[0] ){
					
					 	$(this).append( '<div class="pdo-droll-wrapper_num"></div>' );

					}
					if( $('.pdo-droll-wrapper_num')[0] ){

						$('.pdo-droll-wrapper_num').html($wrapper_num);
					}
				}
			});
		}
		var zoom_arrs = [];

		$( '.stylist_ul_item' ).find( 'li > a' ).each(function() {

			zoom_arrs.push( 
				$( this ).attr( 'vsrc' ) || $( this ).find('img').attr( 'src' )
			);
		});
		$( ".stylist_ul_item li" ).click(function(){
			var zoom_url = $( this ).find( '.ashow_pop' ).attr( 'vsrc' );
			
			/*_Base.imgLoader( zoom_url , function() {

				// 图片的真实高宽
				var img_width = this.width, img_height = this.height, w, h, 

					view_h = $( window ).height() * 0.9;

				if( img_height > view_h ) {
					h = view_h;
					w = h * img_width / img_height;
				} else {
					h = img_height;
					w = img_width;
				}
				var bar_w = 30 ;
				console.log(w);
				// 设置外层宽度
				$( '.stylist-poper' ).css({
					'width'	: ( w + bar_w * 2 ),
					'height': h
				});
			});*/

			

			zoomLoadImage( zoom_url, function() {

				/*$( '.zoom-poper-prev' ).click(function() {
					var url = $( '.stylist-poper' ).find( 'img' ).attr( 'src' ), s_url = swtichImage( zoom_arrs, url, -1 );

					zoomLoadImage( s_url ,function(){} ,'stylist_ul_item' );
					
				});

				$( '.zoom-poper-next' ).click(function() {
					var url = $( '.stylist-poper' ).find( 'img' ).attr( 'src' ), s_url = swtichImage( zoom_arrs, url, 1 );

					zoomLoadImage( s_url , function(){} , 'stylist_ul_item');
					
				});*/
			},'stylist_ul_item');

			return false;


		});



		//設計師信息end        
		
	});
	
	
});