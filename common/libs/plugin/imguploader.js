;(function( $ ) {

$.fn.imguploader = function( options ) {
	return this.each(function() {
		new imguploader( this, options );
	});
};

function imguploader( target, options ) {
	this.target = target;
	
	this.opt = {
		max			: null,
		text		: "Upload Img",
		allowed		: ["jpg", "jpeg", "gif", "png", "bmp"],
		sizeLimit	: 5242880,
		errorPlace	: null,
		// 多文件上传， 非IE
		//multiple	: true,
		fileName	: "file[]",
		messages	: {
			typeError	: "上传文件类型错误",
			sizeError	: "上传文件大小错误",
			numError 	: "超过上传最大个数"
		},
		
		list		: null,
		
		onFinish	: function() {},
		onRemove	: function() {}// this, li, file
	};
	
	$.extend( this.opt, options );
	
	this.init();
}

imguploader.prototype = {
	init: function() {
		
		this.print();
		
		this.addFile();
	},
	
	/**
	 * 输出上传按钮，预览列表等元素
	 *  
	 */
	print: function() {
		
		var elem = $( this.target ), upload_list = !this.opt.list ? '<div class="img-upload-list"></div>' : '';
		
		$( this.target ).html(
			'<div class="img-upload-button" style="position:relative;overflow:hidden;">\
				<span>'+ this.opt.text +'</span>\
			</div>'
		);
		
		if( this.opt.errorPlace == null ) {
			$( this.target ).after( this._error = $( '<div class="img-upload-error" style="display:none"></div>' ) );
		} else {
			$( this.opt.errorPlace ).after( this._error = $( '<div class="img-upload-error" style="display:none"></div>' ) );
		}
		
		if( this.opt.list == null ) {
			elem.find( '.img-upload-button' ).after( '<div class="img-upload-list"></div>' );
		} else {
			// elem.find( '.img-upload-button' ).after(
			// 	$( this.opt.list ).css( 'z-index', 2 )
			// );
			
			this.bindRemove( $( this.opt.list ).find( 'span' ) );
		}
		
		this._handler = elem.find( ".img-upload-button" );
		this._list = !this.opt.list ? elem.find( ".img-upload-list" ) : $( this.opt.list );
		//this._error = elem.find( ".img-upload-error" );
	},
	
	addFile: function() {
		
		//var is_multi = this.opt.multiple ? 'multiple="true"' : '';
		var is_multi = '';
		
		var _this = this,
			
			file = $( '<input type="file" '+ is_multi +' name="'+ this.opt.fileName +'" style="cursor:pointer;position:absolute;opacity:0;filter:alpha(opacity=0);left:-10px;top:-10px;background:#fff;font-size:900px;border:0;width:400px;height:200px;">' );
		
		var cur_len = $( this.target ).find( "input[type='file']" ).length;
		
		if( cur_len < this.opt.max ) {
			this._handler.append( file ).removeClass( "img-upload-disabled" );
			
			file.change(function( event ) {
				_this.getValue( this );
			});
		} else {
			this._handler.addClass( "img-upload-disabled" );
		}
	},
	
	/**
	 * 获取上传组件中的值
	 * 
	 * @param {Object} file_target 当前input.file
	 *  
	 */
	getValue: function( file_target ) {
		
		var imgurl = $( file_target ).val();
		
		// 当前即将上传文件的后缀
		var url_arr = imgurl.split( '.' ), cur_ext = url_arr[ url_arr.length - 1 ].toLowerCase();
		
		if( $.inArray( cur_ext, this.opt.allowed ) == -1 ) {
			// alert( this.opt.messages.typeError );
			this._error.fadeIn( 100 ).html( this.opt.messages.typeError );
			return false;
		} else {
			this._error.fadeOut( 100 );
		}
		
		this.getImgData( file_target );
	},
	
	/**
	 * 获取本地图片数据
	 * 
	 * @param {Object} file_target 当前input.file
	 *  
	 */
	getImgData: function( file_target ) {
		var _this = this, reader = false, files = null;
		
		try {
			reader = new FileReader();
		} catch( e ) {}
		
		// Html5 browser
		if( reader ) {
			var files = file_target.files, total_number = files.length + this._list.find( "li" ).length;
			
			if( this.opt.max !== null && total_number > this.opt.max ) {
				// alert( this.opt.messages.numError );
				this._error.fadeIn( 100 ).html( this.opt.messages.numError );
				return false;
			} else {
				this._error.fadeOut( 100 );
			}
			
			for( var i = 0; i < files.length; i ++ ) {
				
				var reader = new FileReader();
				
				reader.readAsDataURL( files[i] );
				
				reader.onload = function( event ) {
					
					// 检查图片大小
					if( !_this.sizeAllow( event ) ) {
						
						file_target.files = null;
						
						alert( _this.opt.messages.sizeError );
					} else {
						
						_this.addToList( file_target, event.target );
						_this.addFile();
					}
				};
			}
		}
	},
	
	/**
	 * 检查图片大小
	 *   
 	 * @param {Object} event
 	 * 
	 */
	sizeAllow: function( event ) {
		
		if( event.total <= this.opt.sizeLimit ) {
			return true;
		}
		
		return false;
	},
	
	/**
	 * 添加一个预览图到相应容器中
	 *  
 	 * @param {Object} file_target
 	 * @param {Object} img_target
 	 * 
	 */
	addToList: function( file_target, img_target ) {
		var _this = this, url = _item = null;
		
		if( img_target !== undefined ) {
			url = img_target.result || file_target.files[0].getAsDataURL();
			
			_item = $( 
				'<span class="img-upload-item">\
					<img src="'+ url +'" />\
					<a class="img-upload-remove" href="javascript:void(0);"></a>\
				</span>'
			);
		
			this._list.append( _item );
		}
		
		_item[0]._file = file_target;
		
		_item.hide().fadeIn( 360 );
		
		_this.bindRemove( _item );
		
		$( file_target ).css({ width: 0, height: 0, left: "-9999px", top: "-9999px" });
		
		this.opt.onFinish.call( this, _item );
	},
	
	bindRemove: function( li ) {
		var _this = this;
	
		li.find( "a.img-upload-remove" ).click(function() {
			var li = $( this ).parent(), file = $( li[0]._file );
			
			li.fadeOut( 200, function() { $( this ).remove(); });
			file.remove();
			
			var cur_len = $( _this.target ).find( "input[type='file']" ).length;
			
			if( cur_len < _this.opt.max ) {
				_this._handler.removeClass( "img-upload-disabled" );
				_this.addFile();
			}
			
			_this.opt.onRemove.call( _this, li, file );
			
			return false;
		});
	}
};


window.imguploader = imguploader;

	
})( jQuery );
