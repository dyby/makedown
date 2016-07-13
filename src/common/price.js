define( 'price', function( require, exports ) {
	
	/**
	 * 引入包
	 *  
	 */
	var _Base = require( 'base' );

	var api = {};


	// 更新价格
	// is_string 其实尼玛我不知道怎么写名字了，就是改成字符串格式，始终尼玛保持两位小数 
	api.update = function( elem, price, is_string ) {
		var $elem = $( elem );

		if( !$elem.attr( "price" ) ) {
			$elem.attr( "price", 0 );
		}

		var str_price = _Base.math.float( price ) + '', arr_price = str_price.split( '.' ), float_num = '00';

		// 始终补齐 两位小数
		if( arr_price.length ) {
			var float_num = arr_price[ arr_price.length - 1 ];

			for( var i = 0; i < 2 - float_num.length; i ++ ) {
				float_num = float_num + '0';
			}
		}

		price = arr_price[0] + '.' + float_num;

		$elem.attr( "price", _Base.math.float( price ) );

		var _p = byState( price );

		$elem.find( '.smt_price' ).text( _p );
	};

	
	// 根据国家语言修改语种价格标点
	var byState = function( str ) {

		if( str === undefined ) {
			return str;
		}
		
		str = str + '';
		
		var priceArr = str.split( '.' );
		
		// 小数点前面的数字
		var p1 = priceArr.length ? priceArr[0] : str,
			
			arr = _Base.chars.strcut( p1, 3, -1 );
		
		var pointSign = '.';
		// 俄语站为空格
		if( /ru/.test( gvs.langcode ) || gvs.currencycode=='RUB') {
			pointSign = ' ';
		}
		
		// 不进行价格标点转换	
		if( !gvs.isrp ) {
			// 日文不添加  .00
			if( gvs.isjp ) {
				var priceStr = arr.join( '，' ) + ( priceArr.length && priceArr[1] ? '.' + priceArr[1] : '' );
			} else {
				var priceStr = arr.join( ',' ) + ( priceArr.length && priceArr[1] ? pointSign + priceArr[1] : '' );
				//非美元货币设置
				if(gvs.currencycode!="USD" && gvs.currencycode!='RUB'){
					pointSign = ',';
					priceStr = arr.join( '.' ) + ( priceArr.length && priceArr[1] ? pointSign + priceArr[1] : '' );
				}
			}
			//日文货币
			if(gvs.currencycode=='JPY'){
				pointSign = '，';
				
				priceStr = arr.join( '，' ) + ( priceArr.length && priceArr[1] ? pointSign + priceArr[1] : '' );
			}
			if( arr[1] && arr.join( '' ).length < 4 && priceArr.length && priceArr.length < 2 ) {
				if( !/\./.test( priceStr ) ) {
					priceStr += '.00';
				}
			}
			
			priceStr+='';	
			return priceStr;
			
		} else {
			
			if( /es/.test( gvs.langcode ) && arr.join( '' ).length < 5 ) {
				pointSign = '';
			}
			
			var priceStr = arr.join( pointSign ) + ( priceArr.length && priceArr[1] ? ',' + priceArr[1] : '' );
			
			if(gvs.currencycode=="USD"){
				priceStr = arr.join( ',' ) + ( priceArr.length && priceArr[1] ? '.' + priceArr[1] : '' );
			}
			//非美元货币设置
			if(gvs.currencycode!="USD" && gvs.currencycode!='RUB'){
				pointSign = ',';
				
				priceStr = arr.join( '.' ) + ( priceArr.length && priceArr[1] ? pointSign + priceArr[1] : '' );
			}
			//日文货币
			if(gvs.currencycode=='JPY'){
				pointSign = '，';
				
				priceStr = arr.join( '，' ) + ( priceArr.length && priceArr[1] ? pointSign + priceArr[1] : '' );
			}
			if( arr.join( '' ).length < 4 && priceArr.length && priceArr.length < 2 ) {
				if( !/,/.test( priceStr ) ) {
					priceStr += ',00';
				}
			}
			
			priceStr+='';	

			return priceStr;
		}
	};


	return api;

});