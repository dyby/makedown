/**
 * 评论时添加星星个数
 *  
 */
define( 'star', function( require, exports ) {

var star = function( target ) {	

	var parent = target, sArr = $( target ).find( 'em' );
	var rel = $( parent ).attr( 'rel' ), inputText = $( rel );

	sArr.bind( 'click.milanoo_star' ,function() {
		var index = $( this ).index() || 0;
		
		$( parent ).attr( 'id', 'star'+ ( index + 1 ) );
		
		$( parent ).next().html( $( this ).attr( "title" ) ).fadeIn( 200 );
		
		
		if( inputText && inputText.length ) {
			inputText.val( index + 1 );
		}
	}).mouseover(function(){

		var index = $( this ).index() || 0;

		$( parent ).attr("id","star"+ ( index + 1));

	});
		
	$( parent ).mouseout(function(){

		if( inputText.val()=="" ){

			$(this).attr("id","star0");

		}else{

			$(this).attr("id","star"+inputText.val());
			
		}
	});
};

return star;

});