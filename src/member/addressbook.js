


define(function( require, exports, module ) {
	/**
	 * 引入包 
	 */

	 require( 'fancybox' );
	 require( 'validate' );

	 $(function(){

	 	$( ".fancybox" ).fancybox();


		$("#shippig_form").validate({
			event: "blur",
			messages: {
				'ConsigneeName[0]':{
					required: content_required
				},
				'ConsigneeName[1]':{
					required: content_required
				},
				'ConsigneeNameJa[0]':{
					required: content_required
				},
				'ConsigneeNameJa[1]':{
					required: content_required
				},
				'ConsigneeAddr[0]':{
					required: content_required
				},
				'MemberUrbanAreas':{
					required: content_required
				},
				'ConsigneeCity':{
					required: content_required
				},
				'ConsigneePostalcode':{
					required: content_required
				},
				'ConsigneePhone':{
					required: content_required
				}
			},
			submitHandler: function( form ) {
				if( !$( "#notice_no_shipping_consignee" ).is( ":hidden" ) ) {
					if($("#ConsigneeStateId").val()==85){//西班牙
							form.submit();
					}
					if(flag_totally_noConsignee==true){
							return false;
					}
				}	
				form.submit();
			}
		});

		$("#billing_form").validate({
			event: "blur",
			messages: {
				'ConsigneeName[0]':{
					required: content_required
				},
				'ConsigneeName[1]':{
					required: content_required
				},
				'ConsigneeNameJa[0]':{
					required: content_required
				},
				'ConsigneeNameJa[1]':{
					required: content_required
				},
				'ConsigneeAddr[0]':{
					required: content_required
				},
				'MemberUrbanAreas':{
					required: content_required
				},
				'ConsigneeCity':{
					required: content_required
				},
				'ConsigneePostalcode':{
					required:content_required
				},
				'ConsigneePhone':{
					required: content_required
				}
			}
		});

		jQuery.validator.addMethod("milanoo_consignee_phone", function(value, element) {
	    
	      if(this.optional(element) || /^[\-\d]{6,17}$/.test(value))
	      {     
	        return true;
	      }

	      if(value.length<1){
	        this.settings.messages.ConsigneePhone=noMemberPhone;
	      }
	      else if(!value.match(/^[\-\d]+$/))
	      {
	        this.settings.messages.ConsigneePhone=ConsigneePhoneInvalidChar;     
	      }

	      else if(value.length < 6 || value.length > 17)

	      {
	         this.settings.messages.ConsigneePhone=ConsigneePhoneInvalidLength;    
	      }
	     
	      return false;
	    }, "error");
	    
	    jQuery.validator.addMethod("milanoo_consignee_zip", function(value, element) {
	      if(this.optional(element) || /^[a-zA-Z\d\s]+$/.test(value))
	      {
	        return true;
	      }
	      if(value.length<1 || $.trim(value).length==0)
	      {
	        this.settings.messages.ConsigneePostalcode  = noMemberZip;
	      }
	      else if(! value.match(/^[a-zA-Z\d\s]+$/) )
	      {
	        this.settings.messages.ConsigneePostalcode  = ConsigneeZipInvalidChar;
	      }
	      return false;
	    },'error');
	  
	  jQuery.validator.addMethod("milanoo_phone", function(value, element) {  


	      if(this.optional(element) || /^[\-\d]{6,17}$/.test(value))
	      {     
	        return true;
	      }

	      if(value.length<1){
	        this.settings.messages.ConsigneePhone=noMemberPhone;
	      }
	      else if(!value.match(/^[\-\d]+$/))
	      {
	        this.settings.messages.ConsigneePhone=ConsigneePhoneInvalidChar;     
	      }
 
	      else if(value.length < 6 || value.length > 17)
	      {
	         this.settings.messages.ConsigneePhone=ConsigneePhoneInvalidLength;    
	      }
	     
	      return false;
	    }, "error");
	    
	    jQuery.validator.addMethod("milanoo_zip", function(value, element) {
	      if(this.optional(element) || /^[a-zA-Z\d\s]+$/.test(value))
	      {
	        return true;
	      }
	      if(value.length<1 || $.trim(value).length==0)
	      {
	        this.settings.messages.ConsigneePostalcode  = noMemberZip;
	      }
	      else if(! value.match(/^[a-zA-Z\d\s]+$/) )
	      {
	        this.settings.messages.ConsigneePostalcode  = ConsigneeZipInvalidChar;
	      }
	      return false;
	    },'error');



	 });
});