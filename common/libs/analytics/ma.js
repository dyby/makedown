define( 'MA', function() {
	
	// Milanoo analysis
	/* Extend
	<script type="text/javascript">
		var ma.data = {
			pageName: 'index',
			pageTitle: 'milanoo home'
		};
	</script>
	*/
	if( !ma ) { var ma = {}; }
	if(!ma.url) { ma.url = root_url+ '_.gif'; }
	
	if( !gvs ) { var ma = {}; }
	
	var params = [];
	
	// Basic data
	var arrObj = {
		ref	: document.referrer,
		sw	: window.screen.width,
		sh	: window.screen.height
	};
	
	// Extend data
	if( ma.data && $.isPlainObject( ma.data ) ) {
		for( var key in ma.data ) {
			if( !arrObj[ key ] ) {
				arrObj[ key ] = ma.data[ key ];
			}
		}
	}
	
	//encodeURIComponent
	for( var key in arrObj ) {
		params.push( key + "=" + encodeURIComponent( arrObj[ key ] ) );
	}
	
	//ma.url += ( '?' + params.join( '&' ) );
	
	$(function() {
		
		if( gvs && gvs.zp ) {
			for( var key in gvs.zp ) {
				params.push( key + "=" + encodeURIComponent( gvs.zp[ key ] ) );
			}
		}
		
		ma.url += ( '?' + params.join( '&' ) );
		
		$( 'body' ).append( '<img src="'+ ma.url +'" style="display:none" />' );
	});

});