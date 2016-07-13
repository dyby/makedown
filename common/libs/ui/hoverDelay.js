define( 'hoverDelay' , function(require, exports, module){

	var hoverDelay = function(target, overfunc, outfunc, delay ){

		$( target ).hover(
			function() {
				var self = this;
				clearTimeout( this._over_timer );
				clearTimeout( this._out_timer );
				
				this._over_timer = setTimeout(function() {
					overfunc.call( self );
					self._do = true;
				}, delay || 120 );
			},
			function() {
				var self = this;
				clearTimeout( this._over_timer );
				clearTimeout( this._out_timer );
				
				this._out_timer = setTimeout(function() {
					if( self._do ) {
						outfunc.call( self );
						self._do = false;
					}
				}, delay || 120 );
			}
		)
	}

	return hoverDelay;

});