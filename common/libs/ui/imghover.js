/*
 * 创建图片hover效果
*/

define( 'imghover', function( require ) {

	var base = require( 'base' );

	var imghover = function( layout, options ) {
        this.layout = $( layout );
        this.opt = {
            "selector": "a",
            "bgcolor": "#fff",
            "opacity": .3,
            "bordercolor" : "#ddd",
    		"borderwidth" : "2px",
    		"borderstyle" : "solid"
        };
        $.extend( this.opt , options );

        this.init();
    };

    imghover.prototype = {
    	init: function() {
            var _this = this, all = this.layout.find("a"), list = all.filter(function(i) {
                var href = $(this).attr("href"), exprUrl = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(href), allow = ($(this).find("img").length ? !0 : !1) && (href !== undefined ? !0 : !1) && exprUrl;
                return allow ? this : null;
            });
            list.hover(function() {
                this._opa_img || $(this).prepend(this._opa_img = $('<div style="border:'+_this.opt.borderwidth+' '+_this.opt.bordercolor+' '+_this.opt.borderstyle+';cursor:pointer;position:absolute;background:' + _this.opt.bgcolor + ";opacity:" + _this.opt.opacity + ";filter:alpha(opacity=" + _this.opt.opacity * 100 + ');display:none;"></div>')),
                _this.set( this ), _this.show( this );

            }, function() {

                _this.hide( this );

            });
        },    
    	set: function( target ) {
            var elem = $(target),
            	_this =  this,
            	curCss = elem.css("display"),
            	imgs = elem.find( 'img' ),
                _src = imgs.attr( 'src' );

                if( imgs.attr( 'original' ) ){
                    _src = imgs.attr( 'original' );
                }

            base.imgLoader( _src , function(){
                var _url = $( this ).attr( 'src' );
                imgs.attr( 'src', _url);
                
            	var _dwidth = imgs.width()-(parseFloat(_this.opt.borderwidth)*2),
            		_dheight = imgs.height()-(parseFloat(_this.opt.borderwidth)*2),
                    _left = imgs.offset().left,
                    _top = imgs.offset().top;

                    if(imgs.parent().css("position","relative")){
                        _left = imgs.position().left;
                        _top = imgs.position().top;
                    }

            	!/^block/.test(curCss) && /^inline/.test(curCss) && $(target).css("display", "inline-block"), target._opa_img.css({
	                "width": _dwidth,
	                "height": _dheight, 
                    "left" :_left,
                    "top" :_top
	            });

            }); 
        },
        show: function( target ) {
            $( target._opa_img ).show();
        },
        hide: function( target ) {
            $( target._opa_img ).hide();
        }
    }

    return imghover;
});