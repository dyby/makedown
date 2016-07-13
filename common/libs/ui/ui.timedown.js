(function( $ ) {
	
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