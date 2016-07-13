/**
 * 打包配置
 *
 */

'use strict';

module.exports = function( grunt ) {
	
	grunt.file.defaultEncoding = 'utf8';
	
	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),
		
		build: {
			//src: 'src/<%= pkg.name %>.js',
			//dest: 'dist/<%= pkg.name %>.min.js'
		},


// 		cssmin: {
// 			css: {
//                 src: 'common/libs/plugin/cloud-zoom/cloud-zoom.css',
//                 dest: 'dist/css.cloudzoom/cloud-zoom.css'
//             }
// 		},
		
		// 压缩
		uglify: {
            //文件头部输出信息
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                // beautify: true
            },

            
            build: {

            	files: {
					
					// 公用插件
					'dist/common/pack_public_plugin.js': [
						'src/common/config.js',

						'common/libs/base/base.js',
						'common/libs/ui/defval.js',
						'common/libs/ui/imghover.js',
						'common/libs/ui/jselect.js',
						'common/libs/ui/ui.masonry.js',
						'common/libs/util/event.js',
						'common/libs/ui/ui.form.js',
						
						'common/libs/analytics/ma.js',

						'src/common/jchecked.js',
					],
					
					// header
					'dist/common/header.js': [

						'src/common/header.js',
					],



					/*
					 * Home
					 *
					 */
					// 首页
					'dist/index/index.js': [ 

						'common/libs/ui/droll.js',

						'src/index/extAPI.js',

						'src/index/index.js',
					],



					/*
					 * Login
					 *
					 */
					// 登录
					'dist/login/login.js': [ 

						'common/libs/plugin/jquery.validate.js',

						'src/login/login.js',
					],

					// 注册
					'dist/login/join.js': [ 

						'common/libs/plugin/jquery.validate.js',

						'src/login/join.js',
					],


					/*
					 * List
					 *
					 */
					// 列表页
					'dist/list/list.js': [ 

						'common/libs/ui/moreview.js',
						'common/libs/ui/simpleTree.js',

						'src/list/list.js',
					],



					/*
					 * Product
					 *
					 */
					// 终端页
					'dist/product/product.js': [

						'common/libs/ui/droll.js',
						'common/libs/ui/ntab.js',
						'common/libs/ui/ui.cover.js',
						'common/libs/ui/getAddthis.js',
						'common/libs/plugin/fancybox/jquery.fancybox.js',
						'common/libs/plugin/jquery.validate.js',
						'common/libs/plugin/cloud-zoom/cloud-zoom.1.0.2.js',
						'common/libs/plugin/swfobject.js',

						'src/product/main.js',
						'src/product/validate.js',
						'src/common/price.js',

						'src/common/favorite.js',

						'src/product/product.js',
					],

					// 购物车尺码等弹出编辑功能
					'dist/product/product_model.js': [ 
						
						'src/product/main.js',
						'src/product/validate.js',
						'src/common/price.js',
						
						'common/libs/ui/ui.cover.js',

						'src/product/product_model.js',
					],



					/*
					 * Cart
					 *
					 */
					// 购物车
					'dist/cart/shop.js': [ 

						'src/cart/main.js',
						'src/common/price.js',

						'common/libs/ui/droll.js',
						'common/libs/ui/ntab.js',
						'common/libs/plugin/fancybox/jquery.fancybox.js',
						'common/libs/plugin/jquery.validate.js',

						'src/common/favorite.js',

						'src/cart/shop.js',
					],


					// Step1
					'dist/cart/cart.js': [ 

						'src/cart/main.js',
						'src/common/price.js',

						'common/libs/ui/droll.js',
						'common/libs/ui/ntab.js',
						'common/libs/plugin/fancybox/jquery.fancybox.js',
						'common/libs/plugin/jquery.validate.js',

						'src/cart/cart.js',
					],

					// paypal
					'dist/cart/enter.paypal.js': [ 

						'src/cart/main.js',
						'src/common/price.js',

						'common/libs/plugin/fancybox/jquery.fancybox.js',
						'common/libs/plugin/jquery.validate.js',

						'src/cart/enter.paypal.js',
					],


					// 信用卡
					'dist/cart/enter.credit.js': [ 

						'common/libs/plugin/fancybox/jquery.fancybox.js',
						'common/libs/plugin/jquery.validate.js',

						'src/cart/enter.credit.js',
					],




					/*
					 * Member
					 *
					 */
					'dist/member/accountinfo.js'			: [ 
						'common/libs/plugin/jquery.validate.js',

						'src/member/accountinfo.js',
					],
					'dist/member/addressbook.js'			: [ 
						'common/libs/plugin/fancybox/jquery.fancybox.js',
						'common/libs/plugin/jquery.validate.js',

						'src/member/addressbook.js',
					],
					'dist/member/consultationDetail.js'	: [ 
						'common/libs/plugin/jquery.validate.js',

						'src/member/consultationDetail.js',
					],
					'dist/member/couponPromotion.js'		: [ 
						'common/libs/ui/ntab.js',
						'common/libs/ui/hoverDelay.js',

						'src/member/couponPromotion.js',
					],
					'dist/member/forgotpassword.js'		: [ 
						'common/libs/plugin/jquery.validate.js',

						'src/member/forgotpassword.js',
					],
					'dist/member/index.js'				: [ 
						'common/libs/ui/ntab.js',
						'common/libs/ui/droll.js',
						'common/libs/ui/hoverDelay.js',

						'src/member/index.js',
					],
					'dist/member/my_reviews.js'			: [ 'src/member/my_reviews.js' ],
					'dist/member/orderDetails.js'		: [ 
						'common/libs/ui/ntab.js',
						'common/libs/ui/hoverDelay.js',
						'common/libs/plugin/fileuploader.js',
						'common/libs/plugin/fancybox/jquery.fancybox.js',
						'common/libs/plugin/jquery.validate.js',

						'src/member/orderDetails.js',
					],
					'dist/member/orderlist.js'			: [ 
						'common/libs/ui/hoverDelay.js',
						'common/libs/ui/ntab.js',
						'common/libs/ui/droll.js',

						'src/member/orderlist.js',
					],
					'dist/member/qadetails.js'			: [ 
						'common/libs/plugin/fancybox/jquery.fancybox.js',
						'common/libs/plugin/jquery.validate.js',

						'src/member/qadetails.js',
					],
					'dist/member/recenthistory.js'		: [ 
						'common/libs/ui/ntab.js',
						'common/libs/ui/droll.js',

						'src/member/recenthistory.js',
					],
					'dist/member/reviewdetails.js'		: [ 
						'common/libs/plugin/fancybox/jquery.fancybox.js',

						'src/member/reviewdetails.js',
					],
					'dist/member/reviewinviation.js'		: [ 
						'common/libs/ui/ntab.js',
						'common/libs/ui/droll.js',

						'src/member/reviewinviation.js',
					],
					'dist/member/rma.js'					: [ 
						'common/libs/ui/ntab.js',
						'common/libs/plugin/fancybox/jquery.fancybox.js',

						'src/member/rma.js',
					],
					'dist/member/rma_edit.js'			: [ 
						'common/libs/plugin/fileuploader.js',
						'common/libs/plugin/jquery.validate.js',

						'src/member/rma_edit.js',
					],
					'dist/member/saveditem.js'			: [ 
						'common/libs/ui/ntab.js',
						'common/libs/ui/droll.js',

						'src/member/saveditem.js',
					],
					'dist/member/security.js'			: [ 
						'common/libs/plugin/jquery.validate.js',

						'src/member/security.js',
					],
					'dist/member/wishlist.js'			: [ 
						'common/libs/ui/ntab.js',
						'common/libs/ui/droll.js',
						
						'src/member/wishlist.js',
					],




					/*
					 * helpCenter
					 *
					 */
					'dist/helpCenter/afterconsultation.js': [ 
						'src/helpCenter/afterconsultation.js',
						'common/libs/plugin/fileuploader.js',
						'common/libs/plugin/jquery.validate.js',
					],
					'dist/helpCenter/customer.js': [ 
						'src/helpCenter/customer.js',
						'common/libs/plugin/jquery.validate.js',
					],
					'dist/helpCenter/help.js': [ 
						'src/helpCenter/help.js',
						'common/libs/ui/ntab.js',
					],
					'dist/helpCenter/preconsultation.js': [ 
						'src/helpCenter/preconsultation.js',
						'common/libs/plugin/fileuploader.js',
						'common/libs/plugin/jquery.validate.js',
					],
					'dist/helpCenter/search.js': [ 
						'src/helpCenter/search.js',
						'common/libs/ui/ntab.js',
					],



					/*
					 * reviews
					 *
					 */
					'dist/reviews/reviews.js': [ 
						'src/reviews/reviews.js',
						'common/libs/ui/ntab.js',
						'common/libs/plugin/fancybox/jquery.fancybox.js',
						'common/libs/plugin/jquery.validate.js',
					],
					'dist/reviews/reviewsIndex.js': [ 
						'src/reviews/reviewsIndex.js',
					],
					'dist/reviews/reviewsList.js': [ 
						'src/reviews/reviewsList.js',
						'common/libs/ui/simpleTree.js',
						'common/libs/plugin/fancybox/jquery.fancybox.js',
					],
					'dist/reviews/writereview.js': [ 
						'src/reviews/writereview.js',
						'common/libs/plugin/jquery.validate.js',
						'common/libs/plugin/fileuploader.js',
						'common/libs/ui/star.js',
					],





					/*
					 * story
					 *
					 */
					'dist/story/add.js': [ 
						'src/story/add.js',
						'common/libs/plugin/jquery.validate.js',
						'common/libs/ui/droll.js',
						'common/libs/ui/qsearch.js',
					],
					'dist/story/index.js': [ 
						'src/story/index.js',
						'common/libs/plugin/jquery.masonry.min.js',
						'common/libs/ui/getAddthis.js',
					],

					/*
					 * seeall
					 *
					 */	
					'dist/seeall/index.js': [ 
						'src/seeall/index.js',
					], 

					/*
					 * directory - cosplay
					 *
					 */	
					'dist/directory/cosplay.js': [ 
						'common/libs/ui/domsearch.js',
						'common/libs/ui/simpleTree.js',
						'src/directory/cosplay.js',
					], 

					/*
					 * store
					 *
					 */	
					'dist/store/store.js': [ 
						'common/libs/base/base.js',
						'common/libs/ui/droll.js',
						'src/store/store.js',
					],  
            	}
            }
		}
	});
	
	// 合并
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	// 压缩
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	// grunt.loadNpmTasks( 'grunt-css' );
	
	grunt.registerTask( 'default', [ 'uglify' ] );
};