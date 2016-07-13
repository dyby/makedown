/**
 * 页面模块加载配置
 *
 */

seajs.config({
	alias: {
		// 'css.loader'		: pub_url +'image/css/html5.loader.css',
		// 'css.fancybox'	: pub_url +'plugin/fancybox/jquery.fancybox.css',
    
		// 'ntab'		    : pub_url +'ui/ntab.js',
		// 'droll'		    : pub_url +'ui/droll.js',
		// 'fancybox'	    : pub_url +'plugin/fancybox/jquery.fancybox.js',
		// 'validate'	    : pub_url +'plugin/jquery.validate.js',
		// 'ui.form'	    : pub_url +'ui/ui.form.js',
		// 'math'	    	: pub_url +'util/math.js',
		// 'fileuploader'  	: pub_url +'ui/fileuploader.js',
		// 'hoverDelay'		: pub_url +'ui/hoverDelay.js',
		// 'ui.cover'		: pub_url +'ui/ui.cover.js',
		// 'qsearch'		: pub_url +'ui/qsearch.js',
		// 'star'		    : pub_url +'ui/star.js',
		// 'price'			: root_url +'javascript/common/price.js',

		'MA'		    : pub_url +'analytics/ma.js',

		'base'		    : pub_url +'base/base.js',
		'defval'	    : pub_url +'ui/defval.js',
		'imghover'	    : pub_url +'ui/imghover.js',
		'jselect'	    : pub_url +'ui/jselect.js',
		'jchecked'	    : root_url +'javascript/common/jchecked.js',
		'event'	    	: pub_url +'util/event.js',
		'ui.form'	    : pub_url +'ui/ui.form.js',
		'ui.masonry'	: pub_url +'ui/ui.masonry.js'
	},
	charset: 'utf-8'
});

seajs.use( 'MA' );

// 全局函数
window.updateVCode = function( elem, act ) {

	$( elem ).attr( 'src', root_url + 'auth/captcha/?act='+ act + '&' + Math.random() );
};



define(function( require, exports ) {
	
	/**
	 * 引入包
	 *  
	 */
	var _Base = require( 'base' ),
		_Defval = require( 'defval' ),
		_Imghover = require( 'imghover' ),
		_Jselect = require( 'jselect' ),
		_Event = require( 'event' ),
		_Jchecked = require( 'jchecked' ),
		_Masonry = require( 'ui.masonry' );


	 // 调整子导航位置
	 function resetPosition( elem, marker ) {

	 	if( !elem.length ) return;

	 	var r = $( elem ).offset().left + $( elem ).outerWidth(), mr = $( marker ).offset().left + $( marker ).outerWidth();
	 	
	 	if( r > mr ) {
	 		$( elem ).css( 'margin-left', ( r - mr ) * -1 + 'px' );
	 	}
	 }

	 // 菜单
	var MNav = {

		open: function( target ) {

			var submenu = $( target ).find( '.masonry_layout' ), m_target = $( target ).find( '.s-masonry' )[0];

			submenu.show();
			
			// 绑定一次子菜单的瀑布流
			if( !target._masonry && m_target ) {

				new _Masonry( m_target, 'dl', {

					onFinished: function() {

						var // 子菜单左侧实际宽度
							l_width = submenu.find( '.snav_left' ).length ? submenu.find( '.snav_left' ).outerWidth( true ) : 0,

							// 子菜单右侧宽度
							r_width = submenu.find( '.snav_right' ).length ? submenu.find( '.snav_right' ).outerWidth( true ) : 0;

						submenu.css( 'width', ( l_width + r_width ) );

						// 调整导航位置
						resetPosition( submenu, '#mainmenu' );
					}
				});

				target._masonry = true;
			}
		},

		close: function( target ) {

			var submenu = $( target ).find( '.masonry_layout' );
			submenu.hide();
		}
	};


	/**
	* DOM READY
	*  
	*/
	$(function() {

			
		$('.jchecked').each(function() {
			new _Jchecked( this );
		});

		//jselect
		_Jselect( '.s_select' );

		//文本框默认提示
		$( 'input[defval], textarea[defval]' ).each(function() {
			new _Defval( this );
		});

		//商品图片hover效果
		if( $( '.s_goodsimg' ).length ) {
			$( '.s_goodsimg' ).each(function() {
		 		new _Imghover( this , {
		 			"bgcolor": "none",
		 			"opacity": 1,
		 			"bordercolor" : "#ddd",
		    		"borderwidth" : "2px",
		    		"borderstyle" : "solid"
		 		});
		 	});
		}
			
		//图片延时加载
		$( '.lazyload' ).find( 'img' ).each(function(){
			new _Base.lazyload( this );
		});


		// 导航函数
		if( $( '#mainmenu' ).length ) {

			// 查看是否有子菜单
			$( '#mainmenu' ).find( 'li > a:first-child' ).each(function() {
				var cid = $( this ).attr( 'cid' );

				if( cid && _subnav && _subnav[ cid ] ) {
					$( this ).after( _subnav[ cid ] );
				}
			});

			_Event.transit( $( '#mainmenu' ).find( 'li' ), {

				onOver: function( target ) {
					MNav.open( target );
				},
				onOut: function( target ) {
					MNav.close( target );
				}
			});
		}

	});

	
});



;(function( $ ) {
	
$.extend({
	// time diff
	// Return (ms)
	// @param
	// 	@endDate[string] - eg: 2011/09/05 16:00:00
	// 	@startDate[string] - eg: 2011/09/05 16:00:00
	timeDiff: function( endDate, startDate ) {
		return ( new Date( startDate ) ).getTime() - ( new Date( endDate ) ).getTime();
	},
	// date change to seconds
	// Return (s)
	// @param
	// 	@endDate[string] - eg: 2011/09/05 16:00:00
	// 	@timezone - service timezone
	dateToSeconds: function( endDate, startDate, timezone ) {
		if( !timezone ) { timezone = 8; }
	
		var date = new Date(),
		
			// Current client time zone
			tz = date.getTimezoneOffset() / 60;
		
		var // Current date time[current client time or custom date]
			cur = !startDate ? date.getTime() : new Date( startDate ).getTime(), 
			
			// End date time
			end = ( new Date( endDate ) ).getTime();
		
		// The difference between time zones[second]
		return ( end - cur ) / 1000 - ( timezone + tz ) * 60 * 60;
	}
});
	
/**
 * How long seconds to end date
 * Auto End date - Current date
 * @param
 * 	@endDate[string] - 2011/09/05 16:00:00
 * 	@timezone - service timezone
 *
 */
$.secondsToEndtime = function( endDate, timezone ) {
	var date = new Date(),
	
		// Current client time zone
		tz = date.getTimezoneOffset() / 60;
	
	var // Current date time[current client time]
		cur = date.getTime(), 
		
		// End date time
		end = ( new Date( endDate ) ).getTime();
	
	// The difference between time zones[second]
	return ( end - cur ) / 1000 - ( timezone + tz ) * 60 * 60;
}

/* ************************
 * START Time down package
 * ************************/
// Time down API
// @PARAM
//	1. runTime[Int]: timeDown function run time for element (second)
//	2. style[String]: 
//	3. runBack[function]: callback function
//	4. bindAll[boolean]: javascript create the elements also do this function
//	5. syncElem[element]: synchronized with syncElem
//	6. isDays[boolean]
//	7. daysText[string]
//	8. sign[string | array]
$.fn.extend({
	timeDown: function( opt ) {
		var self = this;
		
		this.each(function() {
			$( this ).tdStop();
			
			var settings = {
				// int - second or string - date string (eg: 2011/09/06 16:32:22)
				runTime	: 0,
				
				// string - if runTime is end date
				startDate: '',
				
				// Service time zone, when runTime is date string
				timezone: 8,
				
				style	: '',
				bindAll	: false,
				syncElem: null,
				isDays	: true,
				daysText: 'Days',
				onlyDays: false,
				sign	: ':',
				
				// Default callback
				runBack	: function( hashMap ) {
					var sign = settings.sign, isArr = typeof sign === 'object' && sign.length,
					
						hSign = isArr ? sign[0] : sign,
						mSign = isArr ? sign[1] : sign,
						sSign = isArr ? sign[2] : '';
					
					$( settings.bindAll ? self.selector : this ).html(
						// To display the day or not
						( settings.isDays ? '<span>'+ hashMap.days +'</span> '+ settings.daysText +' ' : '' ) + 
						
						( !settings.onlyDays ? (
								'<span>'+ hashMap.hours +'</span>'+ hSign +
								'<span>'+ hashMap.minutes +'</span>'+ mSign +
								'<span>'+ hashMap.seconds +'</span>'+ sSign
							) : '' )
						
					);
				}
			};
			
			if( !$.isPlainObject( opt ) ) {
				settings.runTime = opt;
			}
			
			$.extend( settings, opt );
			
			// Replace date string to time seconds
			if( typeof settings.runTime === 'string' ) {
				settings.runTime = $.dateToSeconds( settings.runTime, settings.startDate, settings.timezone );
			}
			
			var td = new $.td( this, settings.runBack, settings.syncElem, settings.isDays ),
				
				s = $( this ).attr( 'style' ) == undefined ? '' : $( this ).attr( 'style' );
			
			var newStyle = s + settings.style;
			
			// Set style
			$( this ).attr( 'style', newStyle );
			
			td.init( settings.runTime );
		});
	},
	
	tdStop: function() {
		this.each(function() {
			for ( var i = $.td.timers.length - 1; i >= 0; i-- ) {
				if( $.td.timers[ i ].elem === this ) {
					$.td.timers.splice( i, 1 );
				}
			}
		});
	}
});

$.td = function( elem, callback, syncElem, isDays ) {
	this.elem 		= elem;
	this.callback 	= callback;
	this.isDays 	= isDays;
	this.syncElem 	= syncElem;
};

$.extend( $.td, {
	timerId: null,
	timers: [],
	
	// timeDown listener
	tick: function() {
		for( var i = 0, fn = $.td.timers; i < fn.length; i ++ ) {
			fn[ i ].step();
		}
		
		if( !$.td.timers.length ) {
			clearInterval( $.td.timerId );
			$.td.timerId = null;
		}
	}
});

$.td.prototype = {
	// Get the default
	getDefault: function() {
		return { days: 0, hours: 0, minutes: 0, seconds: 0 };
	},
	
	init: function( runTime ) {
		// Time array, callback to custom
		this.timeMap = this.getDefault();
		
		this.start 	 = ( new Date() ).getTime();
		this.runTime = runTime;
		
		// Only one timerId for timedown function
		if( $.td.timers.push( this ) && !$.td.timerId ) {
			$.td.timerId = setInterval( $.td.tick, 1000 );
		
			$.td.tick();
		}
	},
	
	// Every item step method
	step: function() {
		var timeMap = this.timeMap,
		
			// Current run time 
			ct = ( new Date() ).getTime() - this.start,
		
			leftTime = Math.round( ( this.runTime * 1000 - ct ) / 1000 );
		
		// Diff time for syncElem
		$( this.elem ).data( 'leftTime', leftTime );
		if( this.syncElem && $( this.syncElem ).length ) {
			leftTime = $( this.syncElem ).data( 'leftTime' );
		}
		
		// Doing
		if( leftTime > 0 ) {
			if( this.isDays ) {
				timeMap.days = Math.floor( leftTime  / ( 24 * 3600 ) );
				
				leftTime = leftTime - timeMap.days * 24 * 3600;
			}
			
			timeMap.hours 	= Math.floor( leftTime / 3600 );
			timeMap.minutes	= Math.floor( ( leftTime - timeMap.hours * 3600 ) / 60 );
			timeMap.seconds	= Math.floor( leftTime % 60 );
		} 
		
		// Done
		else {
			// Fix the time
			timeMap = this.getDefault();
			
			// Stop this item
			this.stop();
		}
		
		// Filled two Except days
		for( var key in timeMap ) {
			timeMap[ key ] = ( timeMap[ key ] + '' ).length < 2 && key !== 'days' ? '0' + timeMap[ key ] : timeMap[ key ];
		}

		// Callback
		this.callback.call( this.elem, timeMap );
	},
	
	stop: function() {
		for ( var i = 0; i < $.td.timers.length; i ++ ) {
			if( $.td.timers[i] === this ) {
				$.td.timers.splice( i, 1 );
			}
		}
	}
};
/*
 * END timedown
 */

})( jQuery );

