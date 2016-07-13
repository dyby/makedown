define( 'qsearch', function( require, exports, module ) {

	var ajaxTimer = null,
	hideTimer = null,
	showTimer = null,
	hoverTimer = null,
	menuClass = 'ep_qsearch';
	
	var qsearch = function(elem, option) {
		this.elem = elem;
		this.dropmenu = null;
		this.curValue = null;
		this.keyOn = false;
		this.onDrop = false;
		this.keyIndex = -1;
		this.opt = {
			ajaxUrl: null,
			params: null,
			form: null,
			submitLocked: true,
			ajaxDelay: 200,
			checkRepeat: false,
			selected: 'qsearch_selected',
			loading: '<i style="padding: 4px 10px;">Loading...</i>',
			error: '<i style="padding: 4px 10px;">Error.</i>',
			empty: '<i style="padding: 4px 10px;">Empty.</i>'
		};
		$.extend(this.opt, option);

		this.init();
	};
	qsearch.prototype = {
		init: function() {
			var _this = this;
			$(this.elem).attr('autocomplete', 'off');
			$(this.elem).after(this.dropmenu = $('<div class="' + menuClass + '" style="display:none;"></div>'));
			this.bind();
			this.dropmenu.ajaxStart(function() {});
			this.dropmenu.ajaxError(function() {});
		},
		bind: function() {
			var _this = this;
			$(this.elem).bind({
				click: function() {
					_this.keyIndex = -1;
					_this.keyOn = true;
					_this.getData($.trim($(this).val()), true);
				},
				blur: function() {
					_this.keyOn = false;
					_this.hide();
				},
				keydown: function(ev) {
					if (ev.keyCode === 13) {
						ev.preventDefault();
						ev.stopPropagation();
						return false;
					}
				},
				keyup: function(ev) {
					clearTimeout(ajaxTimer);
					var isAjax = true;
					if (ev.keyCode === 13) {
						_this.toSelect();
						return false;
					}
					if (ev.keyCode === 38 || ev.keyCode === 40) {
						isAjax = false;
					}
					_this.getData($.trim($(this).val()), isAjax);
				},
				mouseup: function() {
					_this.keyOn = true;
					if (_this.curValue == $(this).val()) {
						return false;
					}
				}
			});
			this.dropmenu.bind({
				mouseover: function() {
					_this.onDrop = true;
				},
				mouseout: function() {
					_this.onDrop = false;
				}
			});
			$(document).keyup(function(ev) {
				if (!_this.keyOn) {
					return false;
				}
				switch (ev.keyCode) {
				case 27:
					_this.hide();
					break;
				case 38:
					_this.toPrev();
					break;
				case 40:
					_this.toNext();
					break;
				}
			});
		},
		getData: function(value, isAjax) {
			var _this = this;
			value = $.trim(value);
			if (!/[\d]+|[\w]+/.test(value) || value === '') {
				this.hide();
				return false;
			}
			if (this.curValue !== value) {
				this.keyIndex = -1;
			}
			if (!isAjax || (this.opt.checkRepeat && this.curValue === value)) {
				return false;
			}
			if (!this.opt.ajaxDelay) {
				this.send(value);
				return false;
			}
			ajaxTimer = setTimeout(function() {
				_this.send(value);
			},
			this.opt.ajaxDelay);
		},
		send: function(value) {
			var _this = this,
			url = '',
			addParams = '',
			params = this.opt.params;
			for (var key in params) {
				var elem = params[key];
				if (elem.length) {
					addParams += '&' + key + '=' + $.trim(elem.val());
				}
			}
			addParams += '&keywords=' + value;
			if (!/\?/.test(this.opt.ajaxUrl)) {
				url = this.opt.ajaxUrl + '?';
				addParams = addParams.replace(/^&/, '');
			} else {
				url = this.opt.ajaxUrl;
			}
			url += addParams;
			$.getJSON(url,
			function(json) {
				_this.keyOn = true;
				_this.getHtml(json);
			});
			this.curValue = value;
		},
		getHtml: function(json) {
			if ($.isEmptyObject(json)) {
				this.dropmenu.hide();
				return false;
			}
			var h = ['<ul>'];
			for (var key in json) {
				if (!$.isFunction(json[key])) {
					h.push('<li><a href="javascript:void(0);">' + addHighLight(json[key], this.curValue) + '</a></li>');
				}
			}
			h.push('</ul>');
			this.dropmenu.html(h.join('')).show();
			this.linksEvent();
		},
		linksEvent: function() {
			var _this = this,
			items = $('li', this.dropmenu);
			items.bind({
				click: function() {
					var h = $.trim($(this).text());
					$(_this.elem).val(h);
					_this.dropmenu.hide();
					if ($(_this.opt.form).length) {
						$(_this.opt.form).submit();
					}
				},
				mouseover: function() {
					items.removeClass(_this.opt.selected);
					$(this).addClass(_this.opt.selected);
					var cur = this;
					items.each(function(i) {
						if (this === cur) {
							_this.keyIndex = i;
						}
					});
				}
			});
		},
		show: function() {
			clearTimeout(showTimer);
			var _this = this;
			showTimer = setTimeout(function() {
				_this.dropmenu.show();
			},
			200);
		},
		hide: function() {
			var _this = this;
			if (this.onDrop) {
				$(this.elem).focus();
				return false;
			}
			hideTimer = setTimeout(function() {
				_this.dropmenu.hide();
			},
			200);
		},
		selectItem: function() {
			var _this = this,
			items = $('li', this.dropmenu),
			item = items.eq(this.keyIndex);
			items.removeClass(this.opt.selected);
			item.addClass(this.opt.selected);
			this.dropScroll();
			return $('a', item).text();
		},
		dropScroll: function() {
			var elem = $('li', this.dropmenu).eq(this.keyIndex);
			if (!elem.length) {
				return false;
			}
			var max = this.dropmenu.outerHeight(),
			th = elem.position().top + elem.outerHeight() + this.dropmenu.scrollTop();
			var st = 0;
			if (th > max) {
				st = th - max;
			}
			this.dropmenu.scrollTop(st);
		},
		toSelect: function() {
			if (this.keyIndex == -1) {
				if (!this.opt.submitLocked && $.trim($(this.elem).val()) !== '') {
					$(this.opt.form).submit();
				}
				return false;
			}
			var v = this.selectItem();
			if (!v || $.trim(v) === '') {
				return false;
			}
			$(this.elem).val(v);
			this.dropmenu.hide();
			if (!this.opt.submitLocked) {
				$(this.opt.form).submit();
				return false;
			}
			this.keyIndex = -1;
			$(this.elem).blur();
			return false;
		},
		toPrev: function() {
			if (this.keyIndex > 0) {
				$('li', this.dropmenu).removeClass(this.opt.selected);
				this.keyIndex--;
				this.selectItem();
			}
		},
		toNext: function() {
			if (this.keyIndex < $('li', this.dropmenu).length - 1) {
				$('li', this.dropmenu).removeClass(this.opt.selected);
				this.keyIndex++;
				this.selectItem();
			}
		}
	};
	function addHighLight(str, key) {
		try {
			return str.replace(new RegExp(key, 'i'),
			function(word) {
				return '<b>' + word + '</b>';
			});
		} catch(ex) {}
	}

	return qsearch;
});