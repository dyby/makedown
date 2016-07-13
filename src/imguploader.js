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
		fileName	: "file[]",
		messages	: {
			typeError	: "上传文件类型错误",
			sizeError	: "上传文件大小错误",
			numError 	: "超过上传最大个数"
		},
		
		onFinish	: function() {}
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
		
		var elem = $( this.target );
		
		$( this.target ).html(
			'<div class="img-upload-button" style="position:relative;overflow:hidden;">\
				<span>'+ this.opt.text +'</span>\
			</div>\
			<ul class="img-upload-list"></ul>'
		);
		
		this._handler = elem.find( ".img-upload-button" );
		this._list = elem.find( ".img-upload-list" );
	},
	
	addFile: function() {
		var _this = this,
			
			file = $( '<input type="file" name="'+ this.opt.fileName +'" style="cursor:pointer;position:absolute;opacity:0;filter:alpha(opacity=0);left:-10px;top:-10px;background:#fff;font-size:900px;border:0;width:400px;height:200px;">' );
		
		var cur_len = $( this.target ).find( "input[type='file']" ).length;
		
		if( cur_len < this.opt.max ) {
			this._handler.append( file ).removeClass( "img-upload-disabled" );
			
			file.change(function() {
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
			alert( this.opt.messages.typeError );
			return false;
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
				alert( this.opt.messages.numError );
				return false;
			}
			
			var reader = new FileReader();
			
			reader.readAsDataURL( files[0] );
			
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
		// IE or others
		else {
			// IE 暂时无法在未上传前获取本地图片大小
			if( $.browser.msie ) {
				this.addToList( file_target );
				this.addFile();
			} else {
				alert( 'Error' );
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
				'<li>\
					<img src="'+ url +'" />\
					<a class="img-upload-remove" href="javascript:void(0);"></a>\
				</li>'
			);
		
			this._list.append( _item );
		} 
		// IE
		else {
			_item = $( 
				'<li>\
					<div class="img-upload-ie-preview" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale);"></div>\
					<a class="img-upload-remove" href="javascript:void(0);"></a>\
				</li>'
			);
			
			this._list.append( _item );
			file_target.select();
			file_target.blur();// IE 下拒绝访问问题解决
			
			try {
				_item.find( ".img-upload-ie-preview" )[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
				_item.find( ".img-upload-ie-preview" )[0].filters.item( "DXImageTransform.Microsoft.AlphaImageLoader" ).src = document.selection.createRange().text;
			} catch( ex ) {}
		}
		
		_item[0]._file = file_target;
		
		_item.hide().fadeIn( 360 );
		
		_item.find( "a.img-upload-remove" ).click(function() {
			var li = $( this ).parent(), file = $( li[0]._file );
			
			li.fadeOut( 200, function() { $( this ).remove(); });
			file.remove();
			
			var cur_len = $( _this.target ).find( "input[type='file']" ).length;
			
			if( cur_len < _this.opt.max ) {
				_this._handler.removeClass( "img-upload-disabled" );
				_this.addFile();
			}
			
			return false;
		});
		
		$( file_target ).css({ width: 0, height: 0, left: "-9999px", top: "-9999px" });
		
		this.opt.onFinish.call( this, _item );
	}
};


window.imguploader = imguploader;

	
})( jQuery );
