/**
 * 页面模块加载配置
 *
 */

seajs.config({
	alias: {
		'base'		    : pub_url +'base/base.js',
		'defval'	    : pub_url +'ui/defval.js',
		'imghover'	    : pub_url +'ui/imghover.js',
		'jselect'	    : pub_url +'ui/jselect.js',
		'jchecked'	    : root_url +'javascript/common/jchecked.js',
		'event'	    	: pub_url +'util/event.js',
		'ui.form'	    : pub_url +'ui/ui.form.js',
		'ui.masonry'	: pub_url +'ui/ui.masonry.js',

		'fancybox'	: pub_url + 'plugin/fancybox/jquery.fancybox.js',
		'validate'	: pub_url +'plugin/jquery.validate.js',

		'cart/main'		: root_url + 'javascript/cart/main.js',
		'price'		: root_url + 'javascript/common/price.js',

		'ntab'		: pub_url + 'ui/ntab.js',
		'droll'	    : pub_url + 'ui/droll.js',

		'favorite'	: root_url +'javascript/common/favorite.js',

		'fileuploader'  : pub_url +'plugin/fileuploader.js',
		
        'droll'     : pub_url +'ui/droll.js',
        'extAPI'    : root_url + 'javascript/index/extAPI',

		'moreview'	    : pub_url +'ui/moreview.js',
		'simpleTree'	: pub_url +'ui/simpleTree.js',
		'hoverDelay'	: pub_url +'ui/hoverDelay.js',

		//'css.cloudzoom'	: pub_url + 'plugin/cloud-zoom/cloud-zoom.css',
		'cloudzoom'	: pub_url + 'plugin/cloud-zoom/cloud-zoom.1.0.2.js',

		'getAddthis': pub_url + 'ui/getAddthis.js',
		'ui.cover'	: pub_url + 'ui/ui.cover.js',

		'main'		: root_url + 'javascript/product/main.js',
		'vali'		: root_url + 'javascript/product/validate.js',

		'timedown'	: pub_url + 'ui/ui.timedown.js',

		'star'		    : pub_url +'ui/star.js',
		
        'gmasonry'        : pub_url +'plugin/jquery.masonry.min.js',

        'qsearch'       : pub_url +'ui/qsearch.js',
        'domsearch'		: pub_url +'ui/domsearch.js'
	},
	debug: false,
	charset: 'utf-8'
});