define( function( require, exports, module ) {
	
	/**
	 * 引入包 
	 */
	 var _Domsearch = require( 'domsearch' ),
	 	_SimpleTree = require( 'simpleTree' );

	$(function() {
		//菜单的缩放
		$( '.list_left > dl' ).each(function(){
			new _SimpleTree( this , {
				handler : ">dt",
				toggleClass : "plus",
				showtarget : "dd"
			});
		});

		//搜索
		if( $( "#categoriesSearch" ) && $( "#categoriesSearch" ).length ){
			new _Domsearch( $( "#categoriesSearch" ) , {
				dataItem : $( "#categoriesList" ).find( "li" ),
				dataSource : "a"
			});
		}
		

		//点击筛选同时触发搜索
		$( "#cosplay_search_words a" ).click( function( e ){

			if ( e && e.preventDefault ){
		        e.preventDefault();   
	    	}else{
	    		window.event.returnValue = false;          
	    	}
			w_top=$( $( this ).attr( "href" ) ).offset().top;
			setTimeout(function(){
				$( window ).scrollTop( w_top -30 );
			},100);

			$( "#categoriesSearch" ).val( $( this ).text() );
			$( "#categoriesSearch" ).trigger( "keyup" );

		});
		//搜索时,同时触发筛选项
		$( "#categoriesSearch" ).keyup( function(){
			var val = $.trim( $( this ).val() );

			if( !val.length ){
				$( "#cosplay_search_words" ).find( "a" ).removeClass( "link_now" );
			}else{
				var fword = val.charAt( 0 ), fwExpr = new RegExp( '^' + fword,'i');

				$( "#cosplay_search_words" ).find( "a" ).removeClass( "link_now" );
				
				$( "#cosplay_search_words" ).find( "a" ).each( function(){
					if( fwExpr.test( $.trim( $( this ).text() ) ) ){
						$( this ).addClass( 'link_now' );
					}
				});
			}

			$( ".promotion img" ).each( function(){
				var org = $( this ).attr( "original" );
				if( org ){
					$( this ).attr( "src" , org ).removeAttr( "original" );
				}
			} );

		});


		//屏幕滚动跟随漂浮
		var default_top = $( '#cosplay_search_words').offset().top;
		$(window).scroll(function() {
			var win_top = $( window ).scrollTop();

			if(win_top > default_top){
				$( '#cosplay_search_words').css({
					"position":"fixed",
					"top":"0px",
					"margin-top":"0",
					"z-index":"20"
				});
			}else{
				$( '#cosplay_search_words').css({
					"position":"static",
					"margin-top":"10px"
				});
			}

		});

	});
	
	
});