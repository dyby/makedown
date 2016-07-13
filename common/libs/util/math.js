/**
 * 数学函数包
 *  
 */
define( 'math', function( require, exports ) {

	var B = require( 'base' );
	
	return {
		
		/**
		 * 在圆形半径上的坐标点
		 *
		 */
		pointByRange: function( start_coor, end_coor, range ) {
	
			var // 夹角角度
				angle = Math.atan2( ( end_coor[1] - start_coor[1] ), ( end_coor[0] - start_coor[0] ) ),
				// x 终点坐标
				x = start_coor[0] + Math.cos( angle ) * range,
				// y 终点坐标
				y = start_coor[1] + Math.sin( angle ) * range;
				
			return {
				x: x, y: y, angle: angle
			}
		},
		
		/**
		 * 根据鼠标位置获取角度值 0-360
		 *  
		 */
		mouseAngle: function( x, y ) {
			
			var radians = Math.atan2( x, y ), angle = 180 - radians * ( 180 / Math.PI );
			
			return angle;
		},


		/*
		 * 判断是否发生碰撞
		 * 根据两矩形是否重合判断
		 * 
		 */
		overlap: function( target, match_list ) {

			var $t = $( target );
			
			if( !$t.length || !match_list.length ) {
				return null;
			}

			var t_x_min = $t.offset().left, 
				t_y_min = $t.offset().top, 

				t_x_max = t_x_min + $t.outerWidth( true ),
				t_y_max = t_y_min + $t.outerHeight( true );
			
			for( var i = 0; i < match_list.length; i ++ ) {
				
				var item = match_list[i], $item = $( item );

				if( !$item.length ) {
					continue;
				}
					
				var	item_x_min = $item.offset().left, 
					item_y_min = $item.offset().top, 

					item_x_max = item_x_min + $item.outerWidth( true ),
					item_y_max = item_y_min + $item.outerHeight( true );

				// 判断自己的最大x坐标 以及 y坐标是否 大于 带匹配元素的 x y 的最小坐标
				if( Math.max( t_x_min, item_x_min ) <= Math.min( t_x_max, item_x_max ) && 
					Math.max( t_y_min, item_y_min ) <= Math.min( t_y_max, item_y_max ) ) {
					
					return item;
				}
			}

			return null;
		},


		/*
		 * 在圆形半径上的坐标点
		 *
		 */
		pointOnCircle: function( start_coor, end_coor, range ) {

			var // 夹角角度
				angle = Math.atan2( ( end_coor[1] - start_coor[1] ), ( end_coor[0] - start_coor[0] ) ),
				// x 终点坐标
				x = start_coor[0] + Math.cos( angle ) * range,
				// y 终点坐标
				y = start_coor[1] + Math.sin( angle ) * range;
				
			return [ x, y ];
		},
		
		/*
		 * @params {c_point} 圆心坐标
		 * @params {c_radius} 半径
		 * @params {target} 要比较的元素
		 * var cx = c_radius / dis * ( target.x - point.x) + point.x, cy = c_radius / dis * ( target.y - point.y ) + point.y;
		 */
		inCircle: function( c_point, c_radius, match_point ) {

		    var dis = Math.sqrt(
		    	Math.pow( Math.abs( match_point[0] - c_point[0] ), 2 ) + Math.pow( Math.abs( match_point[1] - c_point[1] ), 2 )
		    );

		    // 在边上也认为在圆内
		    if( dis <= c_radius ) {
				return true;
		    } else {
				return false;
		  }
		}


	}
	
});