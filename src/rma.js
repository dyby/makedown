(function( $ ) {

/**
 * RMA 上传提交交互
 * 
 */
var rma = window.RMA = {};

$.extend( rma, {

	uploadMsg: {},
	
	lang: {
		uploadbtn: "SELECT FILE",
		remove: "确定要删除?"
	},
	
	errorMsg: {
		required: "Required"
	},
	
	// 唯一不重复的主键id
	mainKey: "",
	
	// Required
	// include rma.data.js
	data: {},
	
	// Required
	tpl: "",
	
	// 单词弹出层中上传的最大个数
	uploadMax: 1,
	
	/**
	 * 绑定上传控件
	 *  
 	 * @param {String} uploader_id
 	 * @param {String} list_id
 	 * @param {String} upload_url
 	 * 
	 */
	uploaderInit: function( uploader_id, list_id, upload_url ) {
		var _this = this;
		
		// 修改原 _addToList 方法
		// 创建一个删除按钮
		qq.FileUploader.prototype._addToList = function( id, fileName ) {
			
			var item = qq.toElement(this._options.fileTemplate);
	        if (this._options.disableCancelForFormUploads && !qq.UploadHandlerXhr.isSupported()) {
	            var cancelLink = this._find(item, 'cancel');
	            qq.remove(cancelLink);
	        }
	
	        item.qqFileId = id;
			
	        var fileElement = this._find(item, 'file');
	        qq.setText(fileElement, this._formatFileName(fileName));
	        this._find(item, 'size').style.display = 'none';
	        if (!this._options.multiple) this._clearList();
	        
	        var removeObj = $( '<a class="qq-upload-remove" href="javascript:void(0);">x</a>' );
	        $( item ).append( removeObj ).append( "<span style='display:none;' id='uploaded_backend_file-"+ id +"' class='uploaded_backend_file'></span>" );
	    
	        removeObj.click(function() {
	        	RMA.removeFile( this );
	        });
	        
	        this._listElement.appendChild(item);
		};
		
		
		// 初始化插件
		var uploader = new qq.FileUploader({
			
			uploadButtonText: _this.lang.uploadbtn,
			
			messages: _this.uploadMsg,
			
			allowedExtensions : ["jpg","jpeg","gif","png","doc","docx","bmp","pdf"],
	
			sizeLimit: 5242880, //2MB
			
            element: document.getElementById( uploader_id ),
            action: upload_url,
            disableCancelForFormUploads: true,
            listElement: document.getElementById( list_id ),
            
            onComplete: function( id, filename, responseJSON ) {
            	//console.log( responseJSON )
            	var upload_filename = responseJSON.name,
            		
            		upfile = $( "#uploaded_backend_file-"+ id );
            		
            	upfile.html( upload_filename );
            	
            	_this.uploadState();
            }
        });
	},
	
	// 上传按钮状态
	uploadState: function() {
            	
        var upbtn = $( ".qq-upload-button" ), 
        	// 真实的上传按钮 file
        	upfile = upbtn.find( "input[type='file']" ), exist_list = $( "#file_uploader_list" ).find( ".qq-upload-success" );
		
		if( exist_list.length < rma.uploadMax ) {
			upbtn.removeClass( "upload_disabled" );
			upfile.removeAttr( "disabled" );
		} else {
			upbtn.addClass( "upload_disabled" );
			upfile.attr( "disabled", "disabled" );
		}
	},
	
	/**
	 * 绑定弹出层事件
	 * 
	 * @param {String} selector
	 *   
	 */
	bindFancy: function( selector ) {
		var _this = this, popper = $( "#popper" );
		
		$( selector ).click(function() {
			
			// 设置是否为编辑
			// 编辑则为弹出层创建一个 forid 指向要编辑的项
			var apply_layout = $( this ).parents( ".apply_item" );
			
			if( apply_layout && apply_layout.length ) {
				popper.attr( "forid", apply_layout.attr( "id" ) );
			} else {
				popper.removeAttr( "forid" );
			}
		
			_this.initPopper( this );
			_this.uploadState();
		});
		
		$( selector ).fancybox({
			openMethod 	: "changeIn",
			closeEffect : "elastic"
		});
	},
	
	/**
	 * 初始化弹出层以及弹出层的时间绑定
	 *  
	 */
	init: function( selector ) {
		
		$( "#reason, #solution" ).jselect();
		
		this.bindFancy( selector );
		
		// solution 项某些选项有必须上传的设置
		var upload_elem = $( "#file_uploader" );
		
		$( "#reason" ).change(function() {
			var selected = $( this ).find( "option:selected" );
			
			upload_elem[ selected.attr( "uploadRequired" ) ? "addClass" : "removeClass" ]( "required" );
		});
	},
	
	/**
	 * 初始化弹出层数据
	 *  
	 */
	initPopper: function( target ) {
		
		// 是否为编辑状态
		var is_edit = $( target ).hasClass( "script-edit" );
		
		var _this = this,
		
			// 关联的主键
			forid = !is_edit ? $( target ).attr( "forid" ) : $( target ).parents( ".apply_item" ),
			
			// 数据列表
			list = $( forid ).find( ".script" );
		
		list.each(function() {
			
			// 指向的关联元素
			var rela = $( this ).attr( "relato" );
			
			if( !_this.data[ rela ] ) {
				if( window.console ) {
					console.log( "[ERROR]： 对应关系不全. - " + rela );
				}
				
				return;
			}
			
			var func = _this.data[ rela ].set;
			
			if( func !== undefined ) {
				
				if( !_this.data[ rela ]._target ) {
					_this.data[ rela ]._target = this;
				}
				
				func( this, is_edit );
			}
		});
		
		// 非编辑状态清空弹出层中的数据
		if( !is_edit ) {
			this.dataClear();
			this.data[ '#file_uploader_list' ].set( target );
		}
		
	},
	
	/**
	 * 判断是否允许提交
	 *  
	 */
	submitAllow: function() {
		var _this = this, allow = true, items = $( "#popper" ).find( "select.required, input.required, textarea.required" );
		
		// 验证
		var itemCheck = {
			
			select: function( target ) {
				var select_option = $( target ).find( "option:selected" );
				
				if( /*select_option.index() == 0 &&*/ select_option.val() === "" ) {
					return false;
				}
				
				return true;
			},
			
			textarea: function( target ) {
				if( $.trim( $( target ).val() ) === "" ) {
					return false;
				}
				
				return true;
			}
		};
		
		// 错误提示
		var tipsError = function( target, ispass ) {
			
			if( !target._tips ) {
				target._tips = $( "<label class='error' style='display:none;'>"+ _this.errorMsg.required +"</label>" );
				$( target ).after( target._tips );
			}
			
			target._tips[ ispass ? "fadeOut" : "fadeIn" ]( 200 );
		};
		
		items.each(function() {
			
			var tname = this.tagName.toLowerCase(), ispass = itemCheck[ tname]( this );
			
			if( !ispass ) {
				allow = ispass;
			}
			
			tipsError( this, ispass );
		});
		
		// 判断是否当前的选择项必须传图
		var uploader_elem = $( "#file_uploader" ), uploaded_len = $( "#file_uploader_list" ).find( ".qq-upload-success" ).length;
		
		if( uploader_elem.hasClass( "required" ) ) {
			if( !uploaded_len ) {
				allow = false;
			}
			
			tipsError( uploader_elem[0], allow );
		}
		
		return allow;
	},
	
	/**
	 * 提交当前弹出层数据
 	 * 
	 */
	submit: function() {
		
		if( !this.submitAllow() ) {
			return false;
		}
		
		var tpl = this.tpl, item = curid = null, 
			
			// 应用的数据提交到该容器中
			layout = $( "#hold_data" ),
			
			// 是否为编辑状态
			forelem = $( "#"+ $( "#popper" ).attr( "forid" ) ),
			
			// 替换模版文件中的id 替换符
			tpl = tpl.replace( "{id}", "apply_item-"+ $( ".apply_item" ).length );
		
		for( var key in this.data ) {
			
			// 判断是否为编辑状态
			if( key === RMA.mainKey ) {
				curid = this.data[ key ].get();
			}
			
			tpl = tpl.replace( 
						new RegExp( "{"+ key + "}", "g" ),
						this.data[ key ].get() 
					);
		}
		
		if( forelem.length ) {
			forelem.html( item = $( tpl ) );
		} else {
			layout.prepend( item = $( tpl ) );
		}

		item.hide().slideDown( 600, "easeOutCubic" );
		
		// 修改剩余可提交数量
		this.updateNum( curid, this.data[ "#pronum" ].get(), forelem.length ? true: false );
		
		// 绑定编辑按钮的弹出层事件
		this.bindFancy( item.find( ".fancybox" ) );
		
		this.close();
		
		this.setBtns();
	},
	
	/**
	 * 修改当前的应用的原始数据的可用数量
	 *  
	 * @param {String} source_id
	 * @param {Number} selected_num
	 * @param {Boolean} is_edit
	 *
	 */
	updateNum: function( source_id, selected_num, is_edit ) {
		
		var cur_num = selected_num;
		
		// 如果为编辑状态，判断当前选择的数量是否小于上次选择的数量
		if( is_edit ) {
			var prev_select_len = $( "#pronum" ).find( "option" ).length;
			cur_num = cur_num - prev_select_len;
		}
		
		var // 原始的可退货元素
			elem = $( "#"+ source_id ), 
			
			// 原始列表显示可用数量的元素
			pronum_elem = elem.find( ".script[relato='#pronum']" ),
			
			// 已经应用的元素容器
			apply_elem = $( "#apply_"+ source_id ),
			
			// 已经应用的数量
			apply_num =  Math.floor( apply_elem.find( ".script[relato='#pronum']" ).text() ),
			
			// 剩余可提交退货适量
			left_num = Math.floor( pronum_elem.text() ) - cur_num;
		
		pronum_elem.text( left_num );
		
		if( left_num <= 0 ) {
			elem.find( ".fancybox" ).fadeOut( 200 );
		} else {
			elem.find( ".fancybox" ).fadeIn( 200 );
		}
	},
	
	/**
	 * 移除已经上传文件
	 *  
	 * @param {Object} target
	 */
	removeFile: function( target ) {
		
		$( target ).parent().remove();
		
		this.uploadState();
	},
	
	/**
	 * 移除已经应用的数据
	 * 
	 * @param {Object} target
	 * @param {Boolean} is_confirm 是否需要进行删除验证 
	 * 
	 */
	removeApply: function( target, not_confirm ) {
		var _this = this;
		
		if( not_confirm ) {
			remove();
		} else {
			if( confirm( this.lang.remove ) ) {
				remove();
			}
		}
		
		function remove() {
			var // 当前应用项
				layout = $( target ).parents( ".apply_item" ), 
				// 应用项的对应原始列表的id
				order_id = layout.attr( "forid" ),
				// 要删除应用的数量
				num = layout.find( "input.script[relato='#pronum']" ).val();
			
			layout.slideUp( 500, "easeOutBounce", function() {
				$( this ).remove();
				_this.setBtns();
			});
			
			_this.updateNum( order_id, parseInt( num ) * -1 );
		}
	},
	
	/**
	 * 移除所有的选择应用项
	 *  
	 */
	removeAll: function() {
		var _this = this;
		
		$( "#hold_data" ).find( "a.del_btn" ).each(function() {
			
			_this.removeApply( this, true );
		});
		
		return false;
	},
	
	/**
	 * 设置应用列表中的提交按钮容器是否可用
	 *  
	 */
	setBtns: function() {
		var layout = $( "#submit_buttons" ), len = $( ".apply_item" ).length;
		
		layout[ len > 0 ? "fadeIn" : "fadeOut" ]( 200 );
	},
	
	/**
	 * 关闭弹出层 
	 */
	close: function() {
		$.fancybox.close();
	}
});
	
})( jQuery );