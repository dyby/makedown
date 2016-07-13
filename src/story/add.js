

define( function( require, exports, module ){
	/**
     * 引入包 
     */
     require( 'validate' );

     var _Jselect = require( 'jselect' ),
        _Droll = require( 'droll' ),
        _Qsearch = require( 'qsearch' );

     $(function(){

        //jselect

        $( ".s_select" ).each(function(){
            new _Jselect( this ,{
                onSelect: function(a,b) {
                    //$('#storyCountryName').val($(this).attr("countryName"));
                }
            });

        });

        //droll
        $( "#tab3" ).each(function(){
            new _Droll( this, {
                step: 100,
                moveNum: 9,
                index: 0,
                prevHtml: "",
                nextHtml: "",
                loop: false
            });
        });

        //$('#storyCountryName').val($('#s-countryId').find("option:selected").attr("countryName"));

        //搜索州或者城市
        $('#s-city').each(function(){
            new _Qsearch( this,{
                params: { 'country_id': $('#s-countryId')},
                ajaxUrl: _url+'index.php?module=ajax&action=GetState'
            });
        });

        //验证
        $("#story_form").validate({
            
            messages: {
                'title': _lang.empty_title,
                'nickName': _lang.empty_nickname,
                'countryId': _lang.empty_country,
                'content': _lang.empty_content,
                'productUrl[]':_lang.empty_content
            },
             errorPlacement: function (error, element) { //指定错误信息位置
                if(element.attr( 'name' ) == 'productUrl[]' && element.next( '.del' ).length>0){
                    error.insertAfter(element.next( 'span' ));
                }else{
                    error.insertAfter(element);
                }      
                

            }, 
            submitHandler: function( form ) {
                console.log(xx);

                //$( 'input[type=submit]', form ).attr( 'disabled', 'disabled' ).fadeTo( 100, 0.5 );
               
                if(xx==1){
                     var msg_error="<p style='color:red;' class='msg_error'>"+_lang.mystory_goods_repeat+"</p>";
                     $(".msg_error").remove();
                     $(msg_error).insertBefore($("input[name='allowReply']"));
                    return false;
                }else{
                    ( 'input[type=submit]', form ).removeAttr("disabled");
                    form.submit();
                }
                return false;
            }
        });


     });
});