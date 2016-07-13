/**
 * 数据函数
 * 直接给每个要应用的数据元素进行方法的绑定
 * 
 */
(function( $ ) {
RMA.data = {
	
	// 显示数据-订单id
	'#viewdata-orderid': {
		get: function() { return $( '#viewdata-orderid' ).val(); },
		set: function( target, is_edit ) { $( '#viewdata-orderid' ).val( target ? $( target ).html() : "" ); }
	},
	
	'#viewdata-id': {
		get: function() { return $( '#viewdata-id' ).val(); },
		set: function( target, is_edit ) { $( '#viewdata-id' ).val( target ? $( target ).html() : "" ); }
	},
	
	'#viewdata-img': {
		get: function() { return $( '#viewdata-img' ).val(); },
		set: function( target, is_edit ) { $( '#viewdata-img' ).val( target ? $( target ).html() : "" ); }
	},
	'#viewdata-title': {
		get: function() { return $( '#viewdata-title' ).val(); },
		set: function( target, is_edit ) { $( '#viewdata-title' ).val( target ? $( target ).html() : "" ); }
	},
	
	'#viewdata-prodes': {
		get: function() {
			var str = $( '#viewdata-prodes' ).val();
			return str.replace( /(<pronum>.*<\/pronum>)/, "<b>"+ RMA.data[ "#pronum" ].get() + "</b>" ); 
		},
		set: function( target, is_edit ) { $( '#viewdata-prodes' ).val( target ? $( target ).html() : "" ); }
	},
	
	// 计算当前的退款总额
	'apply_total_price': {
		get: function() {
			return RMA.data[ "#pronum" ].get() * RMA.data[ "#proprice" ].get();
		},
		set: function( target, is_edit ) {}
	},
	
	'#productid': {
		get: function() { return $( '#productid' ).val(); },
		set: function( target, is_edit ) { $( '#productid' ).val( target ? $( target ).html() : "" ); }
	},
	
	'#proprice': {
		get: function() { return parseFloat( $( '#proprice' ).val() ); },
		set: function( target, is_edit ) { $( '#proprice' ).val( target ? $( target ).html() : "" ); }
	},
	
	// 可退货数量
	'#pronum': {
		get: function() { return parseFloat( $( '#pronum' ).find( "option:selected" ).val() ); },
		// 编辑状态，默认选择最大值
		set: function( target, is_edit ) {
			var htmlArr = [], select_elem = $( '#pronum' ), cur_len = Math.floor( $( target ).html() || $( target ).val() );
			
			for( var i = 1; i <= cur_len; i ++ ) {
				htmlArr.push( 
					is_edit && i == cur_len ? "<option selected='selected' value="+ i +">"+ i +"</option>" : "<option value="+ i +">"+ i +"</option>" 
				);
			}
			
			select_elem.html( htmlArr.join( "" ) ).jselect();
		}
	},
	
	// Backend 退货原因
	'#reason_val': {
		get: function() { return $( '#reason' ).find( "option:selected" ).val(); },
		set: function( target, is_edit ) {}
	},
	
	// Backend Solution
	'#solution_val': {
		get: function() { return $( '#solution' ).find( "option:selected" ).val(); },
		set: function( target, is_edit ) {}
	},
	
	// 退货原因
	'#reason': {
		get: function() { return $( '#reason' ).find( "option:selected" ).text(); },
		set: function( target, is_edit ) {}
	},
	
	// Solution
	'#solution': {
		get: function() { return $( '#solution' ).find( "option:selected" ).text(); },
		set: function( target, is_edit ) {}
	},
	
	// 退货原因
	'#details': {
		get: function() { return $( '#details' ).val(); },
		set: function( target, is_edit ) { $( '#details' ).val( target ? $( target ).html() || $( target ).val() : "" ); }
	},
	
	// 隐藏域file 列表
	// 用于后台数据
	'#file_uploader_files': {
		get: function() {
			var arr = [], upload_layout = $( '#file_uploader_list' ), list = upload_layout.find( ".qq-upload-success" );
			
			list.each(function() {
				arr.push( $( this ).find( ".uploaded_backend_file" ).text() );
			});
			
			return arr.join( "|" );
		},
		set: function() {}
	},
	
	// 应用列表中的已传信息
	'#file_uploader_list': {
		get: function() {
			var arr = [], upload_layout = $( '#file_uploader_list' ), list = upload_layout.find( ".qq-upload-success" );
			
			var htmlString = upload_layout.html();
			
			htmlString = htmlString.replace( /class="qq-upload-remove"/g, 'class="qq-upload-remove" style="display:none"' );
			
			return htmlString;
		},
		// target 如果存在 relato 则为编辑状态
		set: function( target ) {
			var is_edit = $( target ).attr( "relato" ), upload_layout = $( '#file_uploader_list' );
			
			if( !is_edit ) {
				upload_layout.empty();
			} else {
				upload_layout.html( $( target ).html() );
				
				var removeObj = upload_layout.find( ".qq-upload-remove" );
				
				removeObj.show().click(function() {
		        	RMA.removeFile( this );
		        });
			}
		}
	}
};


$.extend( RMA, {
	dataClear: function() {
		RMA.data[ '#details' ].set();
	}
});

})( jQuery );