define( 'getAddthis', function( require, exports, module ) {

	var getAddthis = function( target, options){
		this.target = target;

		var langCodeMap = {
			'ja-jp': 'ja_JP',
			'fr-fr': 'fr_FR',
			'es-sp': 'es_ES',
			'de-ge': 'de_DE',  
			'it-it': 'it_IT',
			'ru-ru': 'ru_RU'
			
		};
	
		var FBCodeWidth = {
			'ja-jp': 131,
			'fr-fr': 116,
			'es-sp': 133,
			'de-ge': 137,
			'it-it': 126,
			'ru-ru': 160
			
		};
	
		var TTCodeWidth = {
			'ja-jp': 131,
			'fr-fr': 116,
			'es-sp': 133,
			'de-ge': 137,
			'it-it': 126,
			'ru-ru': 160
			
		};
		
		var _langcode = langCodeMap[ gvs.langcode ] || 'en_US';
		var _FBWidth = FBCodeWidth[ gvs.langcode ] || 104;
		var _TTWidth = TTCodeWidth[ gvs.langcode ] || 89;


		var key = 'ra-4e142e195c4a0844';
		var nowUrl = window.location.href;
		//nowUrl = 'http://www.milanoo.com';
		
		
		var pinitUrl = 'http://pinterest.com/pin/create/button/?url='+ nowUrl;
		
		var addthisHtmlStr= '<div class="sns_all">'+
		'<div class="pinit">'+
		'<div class="pinit_a">'+
		'<a href="'+ pinitUrl +'"'+
		'class="pin-it-button" count-layout="horizontal">Pin It</a></div>'+
		'<scr'+'ipt type="text/javascript" src="http://assets.pinterest.com/js/pinit.js"></scr'+'ipt>'+
		'</div>'+
		'<div class="img_000"></div>'+
		'<div id="fb-root"></div>'+
		'<div class="fb-like" data-href="'+nowUrl+'" data-send="false" data-layout="button_count" data-width="'+ _FBWidth +'" data-show-faces="true"></div>'+
		'<div class="tweet">'+
		'<a href="https://twitter.com/share" class="twitter-share-button" data-url="'+nowUrl+'" data-width="'+ _TTWidth +'" data-lang="'+ _langcode +'">Twitter</a>'+
		'</div>'+
		'<div class="google_1">'+
		'<a class="addthis_button_google_plusone" g:plusone:size="medium" ></a>'+
		'</div>'+
		'<div class="eamil">'+
		'<a href="http://www.addthis.com/bookmark.php" class="addthis_button_email"></a>'+
		'</div>'+
		'<div class="share">'+
		'<a class="addthis_counter addthis_pill_style" ></a>'+
		'</div></div>'+
		'<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id))'+
		'{js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js?lang='+ _langcode +'";fjs.parent'+
		'Node.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>'+
		
		'<scr'+'ipt type="text/javascript">'+
			'(function() {'+
			'var js, fjs = document.getElementsByTagName( "script" )[0];'+
			'if (document.getElementById( "facebook-jssdk" )) return;'+
			'js = document.createElement( "script" ); js.id = "facebook-jssdk";'+
			'js.src = "//connect.facebook.net/'+ _langcode +'/all.js#xfbml=1";'+
			'fjs.parentNode.insertBefore(js, fjs);'+
			'})();'+
			'</scr'+'ipt>'+
			'<scr'+'ipt type="text/javascript" src="//apis.google.com/js/plusone.js">'+
			'</scr'+'ipt>'+
			'<scr'+'ipt type="text/javascript" src="//s7.addthis.com/js/250/addthis_widget.js#pubid='+key+'"></scr'+'ipt>';

		this.target.html( addthisHtmlStr );

	}

	return getAddthis;
});