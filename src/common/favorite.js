

define( 'favorite', function( require, exports, module ) {

	var _Form = require( 'ui.form' );

	var favorite = function( target ) {

		var _this = this, pid = $( target ).attr( 'pid' );

		this.timer = null;
		this.target = target;

		clearTimeout( this.timer );

		_Form.submit.lock( this.target );

		$.ajax({   
			type: "get", 
			url: root_url + "index.php?module=ajax&action=AddToFavorite&exit=1&id="+ pid +'&'+ Math.random(), 
			datatype: "html",
			success: function( h ) {

				var t = _this.target, elem = $( t );
				
				// 创建一个提示层
				if( !t._favtips ) {

					elem.after( 
						t._favtips = $( '<div class="jc_favorite_tips" style="position: absolute; display: none;"></div>' )
					);
				}
				
				t._favtips.fadeIn( 100 ).html( h );
				t._favtips.css({
					'left'	: elem.offset().left + ( elem.outerWidth( true ) - t._favtips.outerWidth( true ) ) * 0.5,
					'top'	: elem.offset().top + elem.outerHeight( true )
					//,'margin-left' : ( elem.outerWidth( true ) - t._favtips.outerWidth( true ) ) * 0.5
				});
				
				_this.timer = setTimeout(function() {
					t._favtips.fadeOut( 100 );
					_Form.submit.unlock( t );
				}, 2000 );
			}
		});

	};

	$(function() {

		$( '.s_favorite' ).click(function() {

			new favorite( this );

			return false;
		});
	});

});