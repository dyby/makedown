
(function() {
var Listener = {
    
    // 仅仅第一次滚动加载
    onceByScroll: function( func, callback ) {
        // Bind the scroll event for window
        $( window ).bind( 'scroll', function() {
            if( !func._once ) {
                
                func();
                
                if( callback && $.isFunction( callback ) ) {
                    callback();
                }
                
                func._once = true;
            }
        });
    }
};

window.Listener = Listener;
var extAPI = {
    
    LANG: function( key ) {
        var langMap ={
            'en-uk': 'en_US',
            'ja-jp': 'ja_JP',
            'fr-fr': 'fr_FR',
            'es-sp': 'es_ES',
            'de-ge': 'de_DE',
            'it-it': 'it_IT',
            'ru-ru': 'ru_RU'
        };
        
        return langMap[ key ] || "en_US";
    },
    
    SNS: {
        facebook: function( callback ) {
            var langCode = extAPI.LANG( ( gvs && gvs.langcode ) || "en-uk" );
            
            function fn() {
                var js, fjs = document.getElementsByTagName( "script" )[0];
      
                if ( document.getElementById( "facebook-jssdk" ) ) return;
                  
                js = document.createElement( "script" ); js.id = "facebook-jssdk";
    
                js.src = "//connect.facebook.net/"+ langCode +"/all.js#xfbml=1";
                
                fjs.parentNode.insertBefore(js, fjs);
            }
            
            Listener.onceByScroll( fn, callback );
        }
    }
};

window.extAPI = extAPI;

})( jQuery );