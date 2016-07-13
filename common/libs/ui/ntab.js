/**
 * TAB 功能，同样适用于导航结构
 *  
 */
define('ntab',function(require, exports, module){
    // $.fn.ntab = function(a) {
    //     this.each(function() {
    //         new ntab(this, a)
    //     })
    // };
    var ntab=function(a, b) {
        this.target = a;
        this.opt = {
            handler: null,
            eventType: "hover",
            hoverActive: true,
            currentClass: "pdo-ntab_current",
            hideDelay: 120,
            index: 0,
            isAnimate: true,
            onShow: function() {},
            onHide: function() {}
        };
        $.extend(this.opt, b);
        this.init()
    }
    ntab.prototype = {
        init: function() {
            var b = this;
            this.H = $(this.target).find(this.opt.handler);
            this.H.each(function(i) {
                var a = $(this).attr("href"),
                cont = $(a);
                this.C = a && cont.length ? cont: $(this).next();
                if (this.C && this.C.length) {
                    this.C[0].H = this;
                    if (b.opt.index !== i) {
                        $(this.C).hide()
                    } else {
                        b.show(this)
                    }
                }
            });
            this.bind()
        },
        bind: function() {
            var b = this,
            stimer = htimer = null;
            if (/click/.test(this.opt.eventType)) {
                this.H[this.opt.eventType](function(a) {
                    delayShow(this);
                    a.preventDefault()
                })
            } else {
                this.H[this.opt.eventType](function() {
                    delayShow(this)
                },
                function() {
                    delayHide(this)
                });
                $(this.target)[this.opt.eventType](function() {
                    clearTimeout(htimer)
                },
                function() {
                    delayShow(null)
                })
            }
            if (/hover/.test(this.opt.eventType) && this.opt.hoverActive) {
                this.H.each(function() {
                    if (!this.C) return;
                    $(this.C)[b.opt.eventType](function() {
                        clearTimeout(htimer)
                    },
                    function() {
                        delayHide(this.H)
                    })
                })
            }
            $(".ntab-handler").each(function() {
                if (!this._bind) {
                    $(this).click(function() {
                        var a = this,
                        relato = $(this).attr("relato"),
                        rela_elems = $(relato),
                        orgi_target = null;
                        rela_elems.each(function() {
                            if ($(this).attr("href") == $(a).attr("href")) {
                                orgi_target = this
                            }
                        });
                        $(orgi_target).click();
                        return false
                    });
                    this._bind = true
                }
            });
            function delayShow(a) {
                clearTimeout(stimer);
                clearTimeout(htimer);
                stimer = setTimeout(function() {
                    b.show(a)
                },
                b.opt.hideDelay)
            }
            function delayHide(a) {
                clearTimeout(stimer);
                clearTimeout(htimer);
                htimer = setTimeout(function() {
                    b.hide(a)
                },
                b.opt.hideDelay)
            }
        },
        show: function(a) {
            var b = this;
            this.H.each(function() {
                $(this)[this === a && a.C && a.C.length ? "addClass": "removeClass"](b.opt.currentClass);
                if (this === a) {
                    if (this.C) {
                        $(this.C)[b.opt.isAnimate ? "fadeIn": "show"](b.opt.isAnimate ? 200 : 0)
                    }
                    b.opt.onShow.call(this, this.C)
                } else {
                    if (!/click/.test(b.opt.eventType)) {
                        $(this.C)[b.opt.isAnimate ? "fadeOut": "hide"](b.opt.isAnimate ? 200 : 0)
                    } else {
                        $(this.C).hide()
                    }
                }
            })
        },
        hide: function(a) {
            $(a).removeClass(this.opt.currentClass);
            if (/click/.test(this.opt.eventType)) {
                $(a.C).hide()
            } else {
                $(a.C).fadeOut(200)
            }
            if (!a) {
                _this.show()
            }
        }
    };

    return ntab;
});