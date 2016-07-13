/*

checkbox && radio

*/
define( 'jchecked' , function( require ) {

var jchecked = function ( elem , opt ) {

	this.elem = elem ;

	this.opt = {
		callfunc: function(){}
	};

	$.extend( this.opt ,opt );


	this.init();
};

jchecked.prototype = {

	init:function(){

		this.wrapper = $('<div class="ck-Wrapper" />') ;
		
		this.idvalue = $(this.elem).attr('id')  ;

		this.attrname = $( this.elem ).attr( 'name' );

	    this.newlabel = $('<label />');

	    this.flag = false ;

	    this.flag_label = false ;

	    //如果没有label 模拟一个出来
	    if( $(this.elem).attr('type') == 'radio' ){

	    	this.newlabel.addClass('new-label-radio');

	    }else if( $(this.elem).attr('type') == 'checkbox' ){
	    	
	    	this.newlabel.addClass('new-label-ckeckbox');

	    }

	    // 判断是否有ID
		if( this.idvalue !== undefined && $.trim( this.idvalue ) !== '' ){

		    if( $(this.elem).siblings('label').attr('for') == this.idvalue){
				this.flag = true;

			}else if( $(this.elem).next('label').length > 0  &&
					  $(this.elem).next('label').attr('for') == undefined ){

				$(this.elem).next('label').attr( 'for', this.idvalue );
				 this.flag = true;
			}else if( $(this.elem).next('label').length == 0 ) {
				
				this.newlabel.attr('for',this.idvalue);	

				this.flag = true;

				this.flag_label =true;
			}
			
		}else{

			var rid = 'jc'+( Math.floor( ( new Date() ).getTime() * Math.random( 99999 ) ) );

			$(this.elem).attr( 'id', rid );
	
			if ( $(this.elem).next('label').length == 0 ){

				this.newlabel.attr('for',rid);

				this.flag_label =true;
				
			}else{

				$(this.elem).next('label').attr( 'for', rid );

			}
			
			this.flag = true;
		}

		this.wrapbox();
	},
	
	wrapbox:function(){
		
		if( this.flag ){

			this.idvalue = $(this.elem).attr('id') ;

			this.$next_label = $('label[for='+this.idvalue+']')  ;

			$(this.elem)[0]._label = this.$next_label[0];

			$(this.elem)[0].inputOther  = $( 'input[name="'+ this.attrname +'"]' );

			if ( $(this.elem).parent().attr('class') != 'ck-Wrapper' ){

				$(this.elem).wrap(this.wrapper);
			}

			if ( this.flag_label ){
			
				$(this.elem).after( this.newlabel );
			
			}else{

				$(this.elem).after( this.$next_label );
			}

			var def_checkbox = $(this.elem).prop('checked');

			//默认选中情况
			if(  $(this.elem).attr('type') == 'radio' ){
				
				this.$next_label.addClass('label-radio');

				if( typeof (def_checkbox) !== "undefined" &&  def_checkbox !== "" && def_checkbox){
				
					this.$next_label.addClass('s-ckeckradio');
					
				}

			}

			if(  $(this.elem).attr('type') == 'checkbox' ){
				
				this.$next_label.addClass('label-checkbox');
					
				if( def_checkbox  ){	

					this.$next_label.addClass('s-checkbox');

				}

			}

			this.bind();

			this.flag = false ;

		}else{

			return false;
		}

	},
	//change后的操作
	events:function(){

		var _this = this , _input = $(this.elem) ;

		var status = _input.is(':checked') ; 

		var _name = _input.attr('name') ;

			if( status ){
				
				if( _input.attr('type') == 'checkbox' ){

					_input.next('label').addClass('s-checkbox');

				}else if( _input.attr('type') == 'radio' ){

					$('input[name="'+_name+'"]').next('label').removeClass('s-ckeckradio');
					
					_input.next('label').addClass('s-ckeckradio');	

				}

				
			}else{

				if( _input.attr('type') == 'checkbox' ){

					_input.next('label').removeClass('s-checkbox');

				}else if( _input.attr('type') == 'radio' ){
					
					_input.next('label').removeClass('s-ckeckradio');	

				}
				
			}



	},
	//绑定事件
	bind:function(){

		var _this = this , elem = $(this.elem) ;
		
		if( $(this.elem).parent().parent().hasClass('disabled') ){

			return false;
			
		}

		elem.change(function(){

			_this.events();

		});

		this.$next_label.click(function(){

			elem.triggerHandler('change');
				
		});
						
		this.opt.callfunc();


	}



};

	return jchecked;
	
});