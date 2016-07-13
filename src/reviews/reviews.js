

define(function( require, exports, module ) {
	/**
	 * 引入包 
	 */
	 require( 'fancybox' );
	 require( 'validate' );

	var _Ntab = require( 'ntab' );
	

	$(function() {

		$('.fancybox').fancybox();

		//tab切换
		$( ".tabs" ).each( function() {
	    	new _Ntab( this , {
		        currentClass: "current",
		        eventType: "click",
		        handler: "a",
		        index:_index
	    	});
		});


		$('.fb_group').fancybox({
	        'transitionIn'	: 'elastic',
	        'transitionOut'	: 'elastic',
	        'loop'			: true,
	        'titlePosition' : 'over',
	        'titleFormat'   : function(title, currentArray, currentIndex, currentOpts) {
	            return '<span id="fancybox-title-over">Image ' +  (currentIndex + 1) + ' / ' + currentArray.length + ' ' + title + '</span>';
	        }
	    });


	    $("#add_qa").validate({
	        messages: {
	            qa_title: _lang.uname_required,
	            qa_content: _lang.content_required,
	            qa_name: _lang.content_required,
	            qa_mail: _lang.nologinname,
				VCode:_lang.uname_required
	        },
			errorPlacement: function (error, element) { //指定错误信息位置
			  if (element.is('.qa_code')) {
				  //var eid = element.attr('name');
				  error.insertAfter(element.next());
			  } else {
				  error.insertAfter(element);
			 }
			}
	    });

	});

});