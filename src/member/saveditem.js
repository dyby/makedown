

define(function( require, exports, module ) {
	
	/**
	 * 引入包 
	 */
	 var _Ntab = require( 'ntab' ),
	 	_Base = require( 'base' ),
	 	_Droll = require( 'droll' );

	$(function() {

		//tab
		$( ".tabs" ).each( function() {

	    	new _Ntab( this , {
		        currentClass: "current",
		        eventType: "click",
		        handler: "a",
		        index:0
		    });
	    });
		//Droll
		$( ".tabs_box" ).each( function(){
			new _Droll( this, {
                step: 155,
                moveNum: 4,
                index: 0,
                loop: true,
                onBeforeInView: function( list ) {
					_Base.handLazy( list );
				}
            });
		});

        $("#select_all").click(function(){
			var current_check = $("#select_all").attr("checked");
			if(current_check == 'checked'){
				$(".m_cart").attr('checked','checked');
			}else{
				$(".m_cart").removeAttr('checked');
			}
		});
		$("#batch_add").click(function(){
			$("#act").val('addall');
		});
		$("#delete_all").click(function(){
			$("#act").val('delall');
		});

	});
});