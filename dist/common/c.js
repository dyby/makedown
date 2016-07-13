/*! Milanoo 2013-11-13 */
seajs.config({
    alias: {
        base: pub_url + "base/base.js",
        defval: pub_url + "ui/defval.js",
        imghover: pub_url + "ui/imghover.js",
        jselect: pub_url + "ui/jselect.js",
        event: pub_url + "util/event.js",
        "ui.form": pub_url + "ui/ui.form.js",
        "ui.masonry": pub_url + "ui/ui.masonry.js"
    },
    charset: "utf-8"
}), window.updateVCode = function(a, b) {
    $(a).attr("src", root_url + "auth/captcha/?act=" + b + "&" + Math.random());
}, define(function(a) {
    function b(a, b) {
        if (a.length) {
            var c = $(a).offset().left + $(a).outerWidth(), d = $(b).offset().left + $(b).outerWidth();
            c > d && $(a).css("margin-left", -1 * (c - d) + "px");
        }
    }
    var c = a("base"), d = a("defval"), e = a("imghover"), f = a("jselect"), g = a("event"), h = a("ui.masonry"), i = {
        open: function(a) {
            var c = $(a).find(".masonry_layout"), d = $(a).find(".s-masonry")[0];
            c.show(), !a._masonry && d && (new h(d, "dl", {
                onFinished: function() {
                    var a = c.find(".snav_left").length ? c.find(".snav_left").outerWidth(!0) : 0, b = c.find(".snav_right").length ? c.find(".snav_right").outerWidth(!0) : 0;
                    c.css("width", a + b);
                }
            }), a._masonry = !0), b(c, "#mainmenu");
        },
        close: function(a) {
            var b = $(a).find(".masonry_layout");
            b.hide();
        }
    };
    $(function() {
        f(".s_select"), alert(1), $("input[defval], textarea[defval]").each(function() {
            new d(this);
        }), $(".s_goodsimg").length && $(".s_goodsimg").each(function() {
            new e(this, {
                bgcolor: "none",
                opacity: 1,
                bordercolor: "#ddd",
                borderwidth: "2px",
                borderstyle: "solid"
            });
        }), $(".lazyload").find("img").each(function() {
            new c.lazyload(this);
        }), g.transit($("#mainmenu").find("li"), {
            onOver: function(a) {
                i.open(a);
            },
            onOut: function(a) {
                i.close(a);
            }
        });
    });
}), define("base", function(a, b) {
    b.now = function() {
        return new Date().getTime();
    }, b.uid = function(a, b) {
        for (var c = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" + new Date().getTime(), b = b || 12, d = [], e = 0; b > e; e++) d.push(c.charAt(Math.floor(Math.random() * c.length)));
        return (void 0 !== a ? a + "-" : "") + d.join("");
    }, b.listen = {
        _t: null,
        resize: function(a) {
            clearTimeout(this._t), this._t = setTimeout(function() {
                $(window).resize(function() {
                    a();
                });
            }, 79);
        }
    }, b.page = {
        screen: {
            width: function() {
                return $(window).width() + $(window).scrollLeft();
            },
            height: function() {
                return $(window).height() + $(window).scrollTop();
            }
        }
    }, b.chars = {
        toJson: function(a) {
            for (var b = {}, c = a.split(";"), d = 0; d < c.length; d++) {
                var e = c[d].split(":");
                b[e[0]] = e[1];
            }
            return b;
        },
        toStr: function(a, b, c) {
            var d = [];
            for (var e in a) d.push(e + (b || ":") + a[e]);
            return d.join(c || ";");
        },
        strcut: function(a, b, c) {
            if (a.length <= b) return [ a ];
            for (var d = [], e = [], f = 0, g = 0; g < a.length; g++) d.push(a.charAt(g));
            -1 === c && d.reverse();
            for (var g = 0; g < d.length; g++) {
                if (0 !== g && 0 == g % b && (-1 === c && e[f].reverse(), e[f] = e[f].join(""), 
                f++), e[f] || (e[f] = []), g === d.length - 1) {
                    e[f].push(d[g]), -1 === c && e[f].reverse(), e[f] = e[f].join("");
                    break;
                }
                e[f].push(d[g]);
            }
            return -1 === c ? e.reverse() : e;
        }
    }, b.math = {
        rand: function(a, b) {
            var c = Math.floor(Math.random() * a);
            return (b || 0) + c;
        },
        "float": function(a, b) {
            var c = "number" == typeof a ? a : parseFloat(a), d = b || 2;
            return isNaN(c) ? null : Math.round(c * Math.pow(10, d)) / Math.pow(10, d);
        }
    }, b.browser = {
        ishtml5: function() {
            return void 0 !== typeof Worker ? !0 : !1;
        }
    }, b.imgLoader = function(a, b) {
        var c = {};
        $.isPlainObject(a) ? c = a : $.isArray(a) || "object" === $.type(a) && !$.isPlainObject(a) ? $.each(a, function() {
            c[$(this).attr("src")] = this;
        }) : "string" == typeof a && (c[a] = []);
        for (var d in c) {
            var e = d, f = new Image();
            if (f.src = e, f._callback = b, f._orgi = c[d], f.complete) return f._callback.call(f._orgi.length ? f._orgi : f, !0), 
            void 0;
            $(f).load(function() {
                this._callback.call(this._orgi.length ? this._orgi : this, !1);
            });
        }
    }, b.handLazy = function(a) {
        $(a).each(function() {
            var a = $(this).find("img"), b = a.attr("src1") || a.attr("original");
            a.attr("src"), b && "" != b && a.attr("src", b).removeAttr("src1").removeAttr("original");
        });
    }, b.lazyload = function(a, b) {
        function c() {
            return (document.body.clientHeight < document.documentElement.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight) + Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        }
        function d() {
            e.each(function() {
                var a = $(this).offset();
                if (a && void 0 !== this.nodeType && a.top <= c() + (b || 0)) {
                    var d = $(this).attr("original");
                    d && $(this).attr("src", d).removeAttr("original");
                }
            });
        }
        var e = $(a);
        d(), $(window).bind("scroll", function() {
            d();
        });
    }, b.goto = function(a) {
        var b = null;
        clearTimeout(b);
        var c = {
            elem: null,
            duration: 400,
            yOffset: 0
        };
        $.extend(c, a), c.elem = $.isPlainObject(a) ? $(c.elem) : $(a);
        var d = 0, e = $(window).scrollTop(), f = new Date().getTime(), g = null !== c.elem && c.elem.length, h = function(a, b, c, d, e) {
            return -d * b * b / (e * e) + 2 * d * b / e + c;
        };
        return c.elem && c.elem.length ? (g && (d = Math.round(c.elem.offset().top)), d + c.yOffset == e ? !1 : (d = Math.floor(d + c.yOffset), 
        b = setInterval(function() {
            var a = new Date().getTime() - f, i = a / c.duration, j = h(i, a, 0, 1, c.duration);
            if (new Date().getTime() > f + c.duration) clearInterval(b), b = null, $(window).scrollTop(d); else {
                var k = (g ? j : 1 - j) * (d - e);
                $(window).scrollTop(e + k);
            }
        }, 17), void 0)) : !1;
    };
}), define("defval", function() {
    var a = function(a, b) {
        this.target = a, this.opt = {
            fontColor: "#999"
        }, $.extend(this.opt, b), this.init();
    };
    return a.prototype = {
        init: function() {
            var a = "s-defval-" + new Date().getTime(), b = $(this.target), c = $(this.target).attr("defval"), d = "none" != b.css("float") ? "" : "position:relative;";
            b.attr("defval", c).val(""), b.wrap('<span class="s-defval_wrap" style="' + d + '"></span>'), 
            b.after('<div id="' + a + '" class="s-defval" style="position:absolute;">' + c + "</div>"), 
            this.target._dv = document.getElementById(a), this.set(), this.bind();
        },
        set: function() {
            var a = {
                margin: [],
                padding: []
            }, b = {}, c = [ "top", "right", "bottom", "left" ], d = $(this.target);
            d.parents(".s-defval_wrap"), dv = $(this.target._dv), b_lr_rela = .5 * this.getNum($(this.target).css("borderLeftWidth"), $(this.target).css("borderRightWidth")) + 2, 
            b_tb_rela = .5 * this.getNum($(this.target).css("borderTopWidth"), $(this.target).css("borderBottomWidth")) + 2, 
            line_hei = d.outerHeight() - b_tb_rela - 2, d.is("textarea") && (line_hei = "22"), 
            isNaN(b_lr_rela) && (b_lr_rela = 2), isNaN(b_tb_rela) && (b_tb_rela = 2);
            for (var e in a) $.each(c, function(b, c) {
                var f = e + "-" + c;
                a[e].push(d.css(f));
            }), b[e] = {}, b[e].tb = this.getNum(a[e][0], a[e][2]), b[e].lr = this.getNum(a[e][1], a[e][3]), 
            a[e] = $.isArray(a[e]) ? a[e].join(" ") : null;
            dv.css({
                left: d.position().left + b_lr_rela + "px",
                top: d.position().top + b_tb_rela + "px",
                width: d.outerWidth() - b.padding.lr - b_lr_rela + "px",
                height: d.outerHeight() - b.padding.tb - b_tb_rela + "px",
                "line-height": line_hei - b.padding.tb + "px",
                padding: a.padding,
                margin: a.margin,
                color: this.opt.fontColor,
                overflow: "hidden",
                "text-overflow": "ellipsis",
                "white-space": "nowrap",
                background: "none",
                cursor: "text"
            }), this.target._dv._t = d;
        },
        getNum: function(a, b) {
            var c = parseInt(a.replace("px", "")) + parseInt(b.replace("px", ""));
            return isNaN(c) ? 0 : c;
        },
        bind: function() {
            $(this.target._dv).click(function() {
                $(this).fadeTo(60, .4), $(this._t).focus();
            }), $(this.target).css("outline", "none").blur(function() {
                var a = $.trim($(this).val());
                a.length || a == $(this._dv).text() || $(this._dv).show().fadeTo(60, 1);
            }).keyup(function() {
                var a = $.trim($(this).val());
                a.length > 0 && $(this._dv).hide();
            }).focus(function() {
                var a = $.trim($(this).val());
                a.length || a == $(this._dv).text() || $(this._dv).fadeTo(60, .4);
            });
        }
    }, a;
}), define("imghover", function(a) {
    var b = a("base"), c = function(a, b) {
        this.layout = $(a), this.opt = {
            selector: "a",
            bgcolor: "#fff",
            opacity: .3,
            bordercolor: "#ddd",
            borderwidth: "2px",
            borderstyle: "solid"
        }, $.extend(this.opt, b), this.init();
    };
    return c.prototype = {
        init: function() {
            var a = this, b = this.layout.find("a"), c = b.filter(function() {
                var a = $(this).attr("href"), b = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a), c = ($(this).find("img").length ? !0 : !1) && (void 0 !== a ? !0 : !1) && b;
                return c ? this : null;
            });
            c.hover(function() {
                this._opa_img || $(this).prepend(this._opa_img = $('<div style="border:' + a.opt.borderwidth + " " + a.opt.bordercolor + " " + a.opt.borderstyle + ";cursor:pointer;position:absolute;background:" + a.opt.bgcolor + ";opacity:" + a.opt.opacity + ";filter:alpha(opacity=" + 100 * a.opt.opacity + ');display:none;"></div>')), 
                a.set(this), a.show(this);
            }, function() {
                a.hide(this);
            });
        },
        set: function(a) {
            var c = $(a), d = this, e = c.css("display"), f = c.find("img"), g = f.attr("src");
            f.attr("original") && (g = f.attr("original")), b.imgLoader(g, function() {
                var b = $(this).attr("src");
                f.attr("src", b);
                var c = f.width() - 2 * parseFloat(d.opt.borderwidth), g = f.height() - 2 * parseFloat(d.opt.borderwidth), h = f.offset().left, i = f.offset().top;
                f.parent().css("position", "relative") && (h = f.position().left, i = f.position().top), 
                !/^block/.test(e) && /^inline/.test(e) && $(a).css("display", "inline-block"), a._opa_img.hide().css({
                    width: c,
                    height: g,
                    left: h,
                    top: i
                });
            });
        },
        show: function(a) {
            $(a._opa_img).show();
        },
        hide: function(a) {
            $(a._opa_img).hide();
        }
    }, c;
}), define("jselect", function() {
    function a(a, b, c) {
        this.target = a, this._total_len = b.length, this.opt = {
            viewNum: 8,
            disabledClass: "model_disabled",
            unClickClass: "disabled_click",
            selectedClass: this.name + "-selected",
            onSelect: function() {}
        }, $.extend(this.opt, c), this.Init();
    }
    var b = null, c = [], d = function(b, c) {
        var d = $(b);
        d.each(function(b) {
            this._index = b, new a(this, d, c);
        });
    };
    return a.prototype = {
        name: "pack_jselect",
        Init: function() {
            this.GetModel(), $(this.target).is(":disabled"), this.Bind();
        },
        GetModel: function() {
            var a = this, b = $(this.target).attr("id"), d = parseInt(this._total_len) - parseInt(this.target._index);
            (void 0 == b || "" == b) && (b = new Date().getTime() * Math.round(999 * Math.random())), 
            b = b + "-" + this.name, (void 0 == d || isNaN(d)) && (d = 0);
            var e = $(this.target).find("option:selected"), f = $(this.target).attr("class"), g = [ "					<div style='z-index:" + d + ";' id='" + b + "' class='" + this.name + " " + f + "'>						<div style=\"position:relative;z-index:1;overflow:hidden;\" class='" + (e.attr("class") || "") + "' value='" + e.val() + "'>							<span>" + e.text() + "</span>							<em class='" + this.name + "_arrow'><em></em></em>						</div>						<input style=\"position:absolute;z-index:-1;width:1px;height:1px;border:0;margin:0 0 0 -10000px;\" id='" + b + "-search' class='" + this.name + '-search\' type="text" value="" />						<ul style=\'z-index:' + d + ";'>" ];
            $(this.target).find("option").each(function(b) {
                var c = $(this).attr("class") ? $(this).attr("class") : "", d = $(this).attr("class") ? "oclass=" + $(this).attr("class") : "";
                e.index() == b && (c += " " + a.opt.selectedClass);
                var f = "", h = $(this).attr("s-color");
                if (h) {
                    var i = "";
                    i = /^#/.test(h) ? "background-color: " + h : 'background-image: url("' + h + '")', 
                    f = "<b class='s-color' style='" + i + "'></b>";
                }
                g.push('<li class="' + c + '" ' + d + ' value="' + $(this).val() + '">' + f + "<span>" + $(this).text() + "</span></li>");
            }), g.push("</ul></div>"), $("#" + b).length && $("#" + b).remove(), $(this.target).after(g.join("")), 
            this.target._$smodel = $("#" + b), $(this.target).is(":disabled") && this.target._$smodel.addClass(this.opt.disabledClass).attr("disabled", "disabled"), 
            c.push(this.target._$smodel), this._$focus = this.target._$smodel.find("div"), this._$ul = this.target._$smodel.find("ul"), 
            this._$search = $("#" + b + "-search"), this.SetStyle();
        },
        SetStyle: function() {
            var a = this.target._$smodel.find("." + this.name + "_arrow").outerWidth(!0) + $(this.target).outerWidth(!0);
            this.target._$smodel.css("width", a);
            var b = $(this.target).attr("rel");
            if (b) for (var c = b.split(","), d = 0; d < c.length; d++) {
                var e = c[d], f = e.split(":"), g = f[0], h = f[1];
                this.target._$smodel.css(g, h);
            }
            this.SetModelListHeight(), $(this.target).hide(), this._$ul.hide();
        },
        SetModelListHeight: function() {
            var a = this;
            if (this.opt.viewNum && $(this.target).find("option").length > this.opt.viewNum) {
                var b = 0;
                this._$ul.find("li").each(function(c) {
                    c < a.opt.viewNum && (b += $(this).outerHeight(!0));
                }), this._$ul.css({
                    height: b,
                    "overflow-y": "scroll"
                });
            }
        },
        GetMaxIndex: function() {
            var a = 0, b = $(".pack_jselect"), c = b.length;
            return b.each(function() {
                var b = parseInt($(this).css("z-index"));
                a = Math.max(a, b ? b : c);
            }), a + 1;
        },
        Bind: function() {
            var a = this;
            this._$focus.bind("click." + this.name, function(d) {
                return clearTimeout(a.timer), $(a._$ul).css("z-index", a.GetMaxIndex()), a.target._$smodel && a.target._$smodel.hasClass(a.opt.disabledClass) || void 0 !== a.target._$smodel.attr("disabled") ? void 0 : (a.timer = setTimeout(function() {
                    d.target !== b && $.each(c, function(a, b) {
                        b.find("ul").hide();
                    }), a[a._$ul.is(":hidden") ? "Open" : "Close"](), b = d.target;
                }, 100), !1);
            }), $(this.target).bind("change." + this.name, function() {
                var b = $(this).find("option:selected"), c = b.index();
                a.UpdateModel(c);
            }), this._$ul.find("li").each(function(a) {
                this._index = a;
            }).bind("click." + this.name, function() {
                return $(this).hasClass(a.opt.unClickClass) ? !1 : (a.Apply(this._index), void 0);
            }).bind("mouseover." + this.name, function() {
                var b = $(this).text().charAt(0);
                a._$search.val(b);
            }), this._$ul.bind("mouseover." + this.name, function() {
                a._in = !0;
            }), this._$ul.bind("mouseout." + this.name, function() {
                a._in = !1;
            }), this._$search.bind("keyup." + this.name, function(b) {
                var c = a._$search.val(), d = c.charAt(c.length - 1), e = a.matchIndex(d);
                null !== e && 0 !== e && (a.UpdateModel(e), a.SetDropScrollTop(e)), 13 == b.keyCode && (a.Apply(e), 
                a._$search.val(""));
            }), $(document).bind("click." + this.name, function() {
                a._in || a.Close();
            }), this._$focus.bind("selectstart", function() {
                return !1;
            }), this._$focus.bind("select", function() {
                document.selection.empty();
            });
        },
        Apply: function(a) {
            var b = this, c = $(this.target).attr("sml:sametrigger") ? $($(this.target).attr("sml:sametrigger")) : $(this.target);
            c.each(function() {
                var c = $(this).find("option").eq(a), d = b._$ul.find("li").eq(a);
                c.attr("selected", "selected"), $(this).triggerHandler("change"), b.opt.onSelect.call(c, a, d);
            }), this.UpdateModel(a), this._$ul.fadeOut(100);
        },
        Open: function() {
            this._$ul.css({
                width: this._$focus.innerWidth()
            }), this._$search.focus(), this._$ul.fadeIn(100);
        },
        Close: function() {
            $.each(c, function(a, b) {
                b.find("ul").hide();
            }), this._$ul.fadeOut(100), this._in = !1;
        },
        UpdateModel: function(a) {
            var b = this._$ul.find("li"), c = void 0 == b.eq(a).attr("oclass") ? "" : b.eq(a).attr("oclass");
            this._$focus.attr({
                value: b.eq(a).attr("val"),
                "class": c
            }), this._$focus.find("span").html(b.eq(a).text()), b.removeClass(this.opt.selectedClass), 
            b.eq(a).addClass(this.opt.selectedClass);
        },
        SetDropScrollTop: function(a) {
            var b = this._$ul.find("li"), c = b.eq(a);
            this._$ul.scrollTop(c.outerHeight(!0) * a);
        },
        matchIndex: function(a) {
            for (var b = this._$ul.find("li"), c = 0; c < b.length; c++) {
                var d = b.eq(c), e = d.text().charAt(0);
                if (e.toLocaleUpperCase() === a.toLocaleUpperCase()) return c;
            }
            return null;
        }
    }, d;
}), define("ui.masonry", [ "base" ], function() {
    function a(a, b, c) {
        this.opt = {
            colnum: 3,
            onFinished: function() {}
        }, $.extend(this.opt, c), this.box = a, this.items = $(a).find(b), this._item_w = 0, 
        this.init();
    }
    return a.prototype = {
        init: function() {
            var a = this;
            this.items.each(function(b) {
                $(this).outerWidth(!0) > a._item_w && (a._item_w = $(this).outerWidth(!0)), this._i = b, 
                this._ri = Math.floor(b / a.opt.colnum), this._height = $(this).outerHeight(!0);
            }), $(this.box).wrapInner('<div class="masonry_wrap" style="position:relative;"></div>'), 
            this.sort();
        },
        sort: function() {
            var a = this;
            this._wrap = $(this.box).find(".masonry_wrap"), this._wrap.css("width", this._item_w * this.opt.colnum + "px"), 
            this.items.css({
                position: "absolute",
                left: 0,
                top: 0
            }), this.items.each(function(b) {
                if (0 == this._ri) return $(this).css("left", b * a._item_w), void 0;
                var c = a.getColMin(this);
                c && $(this).css({
                    left: $(c).position().left,
                    top: $(c).position().top + c._height
                });
            }), this.setWrapHeight();
        },
        getColMin: function(a) {
            var b = this, c = {};
            this.items.each(function(d) {
                if (d < a._i) {
                    var e = $(this).position().left / b._item_w, f = $(this).position().top + this._height;
                    void 0 == c[e] && (c[e] = {
                        target: null,
                        height: 0
                    }), c[e] = {
                        target: this,
                        height: c[e].height + f
                    };
                }
            });
            var d = 999999, e = null;
            for (var f in c) c[f].height < d && (d = c[f].height, e = c[f].target);
            return e;
        },
        setWrapHeight: function() {
            var a = 0;
            this.items.each(function() {
                var b = $(this).position().top + this._height;
                b > a && (a = b);
            }), this._wrap.css("height", a), this.opt.onFinished();
        }
    }, a;
}), define("event", function() {
    function a(a, b) {
        this.target = a, this.opt = {
            pauseGroup: null,
            onOver: function() {},
            onOut: function() {}
        }, $.extend(this.opt, b), this.init();
    }
    var b = {};
    b.transit = function(b, c) {
        $(b).each(function() {
            new a(this, c);
        });
    };
    var c = null, d = [];
    return a.prototype = {
        init: function() {
            var a = this, b = this.target;
            b.onTrigger = function() {
                clearInterval(this.timer), clearTimeout(this.outTimer), this._triggered = !0, this._onOver.call(a, this);
            }, this.bind();
        },
        bind: function() {
            var a = this;
            $(this.target).bind("mouseover.transit", function(b) {
                a.onStart(this, b);
            }), $(this.target).bind("mousemove.transit", function(b) {
                a.onProcess(b);
            }), $(this.target).bind("mouseout.transit", function() {
                a.onStop();
            });
        },
        bindGroup: function() {
            var a = this, b = this.opt.pauseGroup;
            b && b.length && (b.unbind("mouseover.transit").bind("mouseover.transit", function() {
                clearTimeout(a.current.outTimer);
            }), b.unbind("mouseout.transit").bind("mouseout.transit", function() {
                a.onStop();
            }));
        },
        onStart: function(a) {
            var b = this;
            a._onOver = this.opt.onOver, a._onOut = this.opt.onOut, this.current = a, this.coorArr = [ .123456, .654321 ], 
            this.clear(), this.tick(), clearTimeout(b.current.outTimer), this.bindGroup(a), 
            d.push(this.current), this.current.timer = setInterval(function() {
                b.coorArr.push(b.coor), b.compareCoor();
            }, 23);
        },
        onProcess: function(a) {
            this.coor = [ a.pageX, a.pageY ];
        },
        onStop: function() {
            var a = this;
            return this.clear(), this.current && $(this.current).length ? (clearTimeout(this.current.outTimer), 
            this.current.outTimer = setTimeout(function() {
                a.current._triggered && (a.current._onOut.call(a, a.current), a.current._triggered = !1);
            }, 24), void 0) : !1;
        },
        compareCoor: function() {
            var a = this.coorArr, b = a.length, c = a[b - 1], d = a[b - 2];
            c[0] == d[0] && c[1] == d[1] && this.current.onTrigger();
        },
        clear: function() {
            for (var a = 0; a < d.length; a++) {
                var b = d[a];
                b === this.current && (clearInterval(this.current.timer), d.splice(a, 1));
            }
        },
        tick: function() {
            clearTimeout(c), c = setTimeout(function() {
                if (d.length) for (var a = 0; a < d.length; a++) {
                    var b = d[a];
                    clearInterval(b.timer), d.splice(a, 1);
                }
            }, 3e3);
        }
    }, b;
}), seajs.config({
    alias: {
        "css.loader": pub_url + "image/css/html5.loader.css"
    },
    charset: "utf-8"
}), define("ui.form", function(a) {
    var b = a("base"), c = {}, d = {
        play: function(a) {
            a = $(a)[0], a._loader ? a._loader.fadeIn(100) : ($("body").append(a._loader = $('<div class="html5-loading"><i></i></div>')), 
            this.set(a)), this.set(a);
        },
        set: function(a) {
            a = $(a)[0];
            var b = $(a), c = Math.min(b.outerWidth(!0), b.outerHeight(!0)), d = b.outerWidth() > b.outerHeight() ? !0 : !1;
            a._loader.css({
                width: c - (a._loader.outerWidth(!0) - a._loader.outerWidth()),
                height: c - (a._loader.outerWidth(!0) - a._loader.outerWidth()),
                left: b.offset()[d ? "left" : "top"],
                top: b.offset()[d ? "top" : "left"]
            }).css({
                "margin-left": .5 * (b.outerWidth() - a._loader.outerWidth()),
                "margin-top": .5 * (b.outerHeight() - a._loader.outerHeight())
            }).fadeIn(100);
        },
        stop: function(a) {
            a._loader.fadeOut(100);
        }
    };
    return c.submit = {
        lock: function(c, e) {
            c = $(c)[0];
            var f = /input|button/i.exec(c.nodeName);
            f && (c._class = "disabled", null !== e && (/input/i.test(f[0]) && (c.__store = [ $(c).val(), "val" ], 
            $(c).val(e)), /button/i.test(f[0]) && (c.__store = [ $(c).text(), "text" ], $(c).text(e))), 
            $(c).addClass(c._class).attr("disabled", "disabled"), b.browser.ishtml5() && (a.async("css.loader"), 
            d.play(c)));
        },
        unlock: function(a) {
            a = $(a)[0], b.browser.ishtml5() && d.stop(a), void 0 !== a.__store && $(a)[a.__store[1]](a.__store[0]), 
            $(a).removeAttr("disabled").removeClass(a._class);
        }
    }, c.getParams = function(a) {
        var b = null, c = [];
        return $(a).find("input[type=text], input[type=password], input[type=radio], input[type=checkbox], select").each(function() {
            var a = $(this).attr("name"), b = null;
            b = /select/i.test(this.nodeName) ? $.trim($(this).find("option:selected").val()) : $.trim($(this).val()), 
            a && b && c.push(a + "=" + b);
        }), c.length && (b = c.join("&")), b;
    }, c;
});