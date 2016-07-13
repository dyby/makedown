define( 'dzoom', function( require, exports ) {
	
    $.imgload = function(a, b) {
        var c = new Image;
        c.src = a;
        if (c.complete) {
            b.call(c, true);
            return
        }
        c.onload = function() {
            b.call(c, false)
        }
    };
    
    $.extend({
        xMouse: function( event ) {
            return event.pageX || event.clientX + $( document ).scrollLeft()
        },
        yMouse: function(event) {
            return event.pageY || event.clientY + $( document ).scrollTop()
        }
    });
    
    $.extend( $.easing, {
        easeout: function(a, b, c, d, e) {
            return -d * b * b / (e * e) + 2 * d * b / e + c
        }
    });
    
    var dzoom = function( target, options ) {
        this.elem = target;
        this.view = null;
        this.mover = null;
        this.loader = null;
        this.img = null;
        this.xCenter = 0;
        this.yCenter = 0;
        this.xcur = 0;
        this.ycur = 0;
        this.movelocked = false;
        
        this.opt = {
            type: "inside",
            loadHtml: "loading...",
            moveback: true,
            preview: true
        };
        
        $.extend( this.opt, options );
    };
    
    dzoom.prototype = {
    	
        init: function() {
            var _this = this;
            this.img = $( this.elem ).find( "img" );
            
            if ( $( this.img ).length ) {
                this.create();
                
                $.imgload(this.img.attr("src"), function( img ) {
                    _this.setNum();
                    
                    if( img ) {
                        _this.loader.hide();
                        _this.tocenter()
                    } else {
                        _this.loader.fadeOut(400);
                        _this.tocenter(true)
                    }
                    
                    _this.events();
                });
                
                $( this.elem ).mousemove(function( event ) {
                    _this.getCurMove( event, this );
                    if (_this.movelocked) return false;
                    _this.tomove();
                    return false
                });
            }
        },
        
        create: function() {
            var b = [],
                c = $(this.elem).width(),
                d = $(this.elem).height();
            if (this.opt.type == "inside") {
                    b.push('<div style="width:' + c + "px;height:" + d + 'px;overflow:hidden;position:relative;cursor:move;">');
                    b.push('<div class="dzoom-mover" style="z-index:0;position:absolute;"></div>');
                    if (this.opt.preview) {
                        b.push('<div class="dzoom-view" style="z-index:1;width:' + c + "px;height:" + d + 'px;display:table;overflow:hidden;position:absolute;top:0;left:0;background:#fff;cursor:move;"></div>')
                    }
                    b.push('<div class="dzoom-loading" style="z-index:2;color:#fff;opacity:0.8;filter:alpha(opacity=80);padding:4px 14px;border:1px solid #000;background:#333;position:absolute;">' + this.opt.loadHtml + "</div>");
                    b.push("</div>")
                }
            $(this.elem).wrapInner(b.join(""));
            var e = this.img.attr("src");
            this.mover = $(this.elem).find("div.dzoom-mover");
            this.loader = $(this.elem).find("div.dzoom-loading");
            if (this.opt.preview) {
                    this.view = $(this.elem).find("div.dzoom-view");
                    this.view.html('<div style="display:table-cell;text-align:center;vertical-align:middle;">' + '<img src="' + e + '" style="max-width:' + c + "px;max-height:" + d + 'px;" />' + "</div>")
                }
            this.loader.css({
                    top: (d - this.loader.outerHeight()) / 2,
                    left: (c - this.loader.outerWidth()) / 2
                })
        },
        
        events: function() {
            var b = this,
                c = backTimer = null;
            $(this.elem).hover(function(a) {
                    var d = this;
                    b.movelocked = false;
                    clearTimeout(backTimer);
                    clearTimeout(c);
                    c = setTimeout(function() {
                        if (b.opt.preview) {
                            b.view.fadeOut(400)
                        }
                        b.tomove(true)
                    }, 200)
                }, function() {
                    b.movelocked = true;
                    clearTimeout(backTimer);
                    clearTimeout(c);
                    if (b.opt.moveback) {
                        backTimer = setTimeout(function() {
                            if (b.opt.preview) {
                                b.view.fadeIn(400)
                            }
                            b.tocenter(true)
                        }, 800)
                    }
                })
        },
        
        setNum: function() {
            this.xCenter = Math.round(($(this.elem).outerWidth() - $(this.mover).outerWidth()) / 2);
            this.yCenter = Math.round(($(this.elem).outerHeight() - $(this.mover).outerHeight()) / 2)
        },
        
        tocenter: function(b) {
            if (b) {
                $(this.mover).animate({
                    left: this.xCenter,
                    top: this.yCenter
                }, 600, "easeout")
            } else {
                $(this.mover).css({
                    left: this.xCenter,
                    top: this.yCenter
                })
            }
        },
        
        getCurMove: function(b, c) {
            var d = Math.round($.xMouse(b) - $(c).offset().left),
                e = Math.round($.yMouse(b) - $(c).offset().top);
            var f = this.xCenter * (d / ($(this.elem).outerWidth() / 2)),
                g = this.yCenter * (e / ($(this.elem).outerHeight() / 2));
            this.xcur = f;
            this.ycur = g
        },
        
        tomove: function(b) {
            var c = this;
            var d = {};
            if ($(this.img).width() > $(this.elem).outerWidth()) {
                d.left = this.xcur
            }
            if ($(this.img).height() > $(this.elem).outerHeight()) {
                d.top = this.ycur
            }
            $(this.mover).stop();
            if (b) {
                $(this.mover).animate(d, 400, "easeout")
            } else {
                $(this.mover).css(d)
            }
        }
    };
    
    return dzoom;
    
});