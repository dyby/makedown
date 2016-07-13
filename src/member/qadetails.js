

define(function( require, exports, module ) {
	/**
	 * 引入包 
	 */
	 require( 'fancybox' );
     require( 'validate' );

     $(function(){

        $('.fancybox').fancybox({});

        $("#add_qa").validate({
            messages: {
                qa_title: _lang.uname_required,
                qa_content: _lang.content_required,
                VCode: _lang.content_required
            },
            errorPlacement: function (error, element) { //指定错误信息位置
                if( element.attr( 'name' ) =="VCode" ){
                     error.insertAfter(element.next( 'a' ));
                }else{
                     error.insertAfter(element);
                }  
            }, 
        });
        
     });
});