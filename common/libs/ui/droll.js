/**
 * 支持无缝滚动
 * 支持外部按钮控制滚动
 * 
 */
define( 'droll', function( require, exports, module ) {

    var droll = function( target, options ) {
        
        this.autoTimer = null;
        
        this.target = target;
        
        this.opt = {
            
            // *required
            // 每次移动的步长
            step        : null,
            
            // *required
            // 每次滚动项个数
            moveNum     : null,
            
            // 索引按钮的事件触发方式
            eventType   : "click",
            
            // 默认水平方向滚动
            isHori      : true,
            
            index       : 0,
            
            // 自动播放
            auto        : false,
            
            // 自动播放的间隔时间
            autoDelay   : 5000,
            
            // 滚动速度，该值越低速度越快
            speed       : 500,
            
            // 方向按钮是否显示
            dirButton   : true,
            
            // 索引按钮的列表是否显示
            indexButton : false,
            
            // 触发关联事件的按钮
            // 用户可以在元素外部自定义多个可以触发滚动功能的元素列表
            // *该按钮在loop 状态下不会启用
            relaBtns    : null,
            
            listCurClass: "pdo-droll_list_current",
            
            // 当前展示的索引项样式
            ibtnCurClass: "pdo-droll_btn_current",
            
            // 按钮不可点击样式
            lockedClass : "pdo-droll_btn_locked",
            
            prevHtml    : "&lt;",
            
            nextHtml    : "&gt;",
            
            // 滚动列表是否无限循环
            loop        : true,
            
            // 列表项的外容器选择器
            outerSelector   : "ul",
            
            // 列表项选择器
            itemsSelector   : "li",
            
            // 只有鼠标覆盖到相关元素上按钮才会显示
            btnHoverActive  : false,
            
            onFinished      : function( target, inview_elems ) {},
            onBeforeInView  : function( target, inview_elems ) {}
        };
        
        $.extend( this.opt, options );
        
        // 滚动项的个数
        this.LENGTH = 0;
        
        // 动画进行中不再继续执行动画
        this.LOCKED = false;
            
        // 当前索引
        this.I = this.opt.index;
        
        // 上次点击的按钮索引
        this.PREVI = this.opt.index;
        
        this.init();
        
    }

    droll.prototype = {
        
        init: function() {
            var _this = this;
            
            this.LENGTH = $( this.target ).find( this.opt.outerSelector ).find( this.opt.itemsSelector ).length;
            
            if( this.LENGTH <= this.opt.moveNum ) {
                this.opt.loop = false;
            }
            
            this.printWrapper();
            this.setParams();
            this.bindEvents();
            
            this.setListState();
            this.setDirBtnState();
            this.setIndexBtnState( this.opt.index );
            
            if( this.LENGTH <= this.opt.moveNum ) {
                this.opt.onBeforeInView.call( this.target, $( this.target ).find( this.opt.outerSelector ).find( this.opt.itemsSelector ) );
                return;
            }
            
            // 如果第一个展示的索引项不是第一个则进行一次移动
            if( this.opt.index !== 0 ) {
                this.move();
            } else {
                this.opt.onBeforeInView.call( this.target, this.getInViewList() );
            }
            
            if( this.opt.auto ) {
                this.auto();
                
                $( this.target ).hover(function() {
                    clearTimeout( _this.autoTimer );
                }, function() {
                    _this.auto();
                });
            }
        },
        
        /**
         * 输出滚动元素的外层容器以及按钮
         *  
         */
        printWrapper: function() {
            
            // 索引按钮
            var numlists = '', elem = $( this.target );
                
            var style = this.opt.isHori ? 
                            'width: '+ this.opt.step * this.opt.moveNum +'px; height: '+ $( this.target ).outerHeight() +'px;':
                            'height: '+ this.opt.step * this.opt.moveNum +'px; width: '+ $( this.target ).outerWidth() +'px;';
            
            for( var i = 0; i < this.LENGTH / this.opt.moveNum; i ++ ) {
                numlists += '<a href="javascript:void(0);">'+ ( i + 1 ) +'</a>';
            }
            
            // 添加位移容易的外层容器
            elem.find( this.opt.outerSelector ).wrap( '<div style="'+ style +'z-index:1;" class="pdo-droll"></div>' );
            
            // 添加最外层容器
            elem.find( ".pdo-droll" ).wrap( '<div style="'+ style +'" class="pdo-droll_layout"></div>' );
            
            // 添加
            elem.find( ".pdo-droll_layout" ).append( '\
                <div class="pdo-droll_dirbutton" style="display:none;">\
                    <a class="pdo-droll_prev" href="javascript:void(0);"><span><span></a>\
                    <a class="pdo-droll_next" href="javascript:void(0);"><span><span></a>\
                </div>\
                <div class="pdo-droll_numbutton" style="display:none;">'+ numlists +'</div>\
            ');
            
            
            // 如果需要做无缝滚动
            if( this.opt.loop ) {
                
                // var outer = elem.find( this.opt.outerSelector ), list = outer.find( this.opt.itemsSelector ),
                    
                //     first_start = this.LENGTH - this.opt.moveNum, first_end = first_start + this.opt.moveNum;
                
                // // 内容列表的从原始列表最后一项倒推添加滚屏个数的元素
                // for( var i = first_start; i < first_end; i ++ ) {
                //     list.eq( 0 ).before( list.eq( i ).clone() );
                // }
                // // 内容列表的从原始列表第一项倒推添加滚屏个数的元素
                // for( var i = this.opt.moveNum - 1; i >= 0; i -- ) {
                //     list.eq( this.LENGTH - 1 ).after( list.eq( i ).clone( true ) );
                // }
                
                // this.I += this.opt.moveNum;
                
                // this.LENGTH = this.LENGTH + this.opt.moveNum * 2;
                
                // outer.css( this.opt.isHori ? "left" : "top", this.opt.moveNum * this.opt.step * -1 );
            }
        },
        
        /**
         * 设置一些内部将要使用的参数以及按钮列表是否显示
         *  
         */
        setParams: function() {
            var elem = $( this.target );
            
            this.ELEM = {
                outer   : elem.find( "pdo-droll" ),
                cont    : elem.find( this.opt.outerSelector ),
                dirbtn  : elem.find( "div.pdo-droll_dirbutton" ),
                numbtn  : elem.find( "div.pdo-droll_numbutton" ),
                prev    : elem.find( "a.pdo-droll_prev" ),
                next    : elem.find( "a.pdo-droll_next" )
            };
            
            if( this.opt.dirButton && !this.opt.btnHoverActive ) {
                this.ELEM.dirbtn.fadeIn( 200 );
            }
            
            if( /*!this.opt.loop &&*/ this.opt.indexButton ) {
                this.ELEM.numbtn.fadeIn( 200 );
            }
            
            var size = this.opt.step * this.ELEM.cont.find( this.opt.itemsSelector ).length;
            
            this.ELEM.cont[ this.opt.isHori ? "width" : "height" ]( size ).css( "position", "absolute" );
        },
        
        /**
         * 绑定事件
         *  
         */
        bindEvents: function() {
            
            var _this = this;
            
            this.ELEM.prev.click(function() {

                if( _this.I <= 0 ){
                    _this.move( ( _this.LENGTH-1 ) * _this.opt.moveNum );
                }else{
                    _this.move( -1 * _this.opt.moveNum );
                }
                
            });
            
            this.ELEM.next.click(function() {
                _this.move( 1 * _this.opt.moveNum );
            });
            
            // 只有当鼠标覆盖元素对象时，按钮才显示
            if( this.opt.btnHoverActive ) {
                this.target.ha_stimer = null;
                this.target.ha_htimer = null;
                
                $( this.target ).hover(
                    function() {
                        clearTimeout( _this.target.ha_stimer );
                        clearTimeout( _this.target.ha_htimer );
                        
                        _this.target.ha_stimer = setTimeout(function() {
                            _this.ELEM.dirbtn.fadeIn( 120 );
                        }, 100 );
                    },
                    function() {
                        clearTimeout( _this.target.ha_stimer );
                        clearTimeout( _this.target.ha_htimer );
                        
                        _this.target.ha_htimer = setTimeout(function() {
                            _this.ELEM.dirbtn.fadeOut( 120 );
                        }, 100 );
                    }
                );
                
                this.ELEM.dirbtn.mouseover(function() {
                    clearTimeout( _this.target.ha_stimer );
                    clearTimeout( _this.target.ha_htimer );
                });
            }
            
            // 索引按钮
            //if( !_this.opt.loop ) {
                this.ELEM.numbtn.find( "a" )[ this.opt.eventType ](function() {
                    
                    _this.move( $( this ).index() * _this.opt.moveNum - _this.I );
                });
            //}
            
            // 存在关联按钮
            if( !this.opt.loop && this.opt.relaBtns ) {
                this.opt.relaBtns[ this.opt.eventType ](function() {
                    var orgBtns = _this.ELEM.numbtn.find( "a" ).eq( $( this ).index() );
                    
                    orgBtns.triggerHandler( _this.opt.eventType );
                });
            }
        },
        
        /**
         * 移动函数
         * 
         * @param {Number} move_num 移动的相对数量，负数则向前移动
         *  
         */
        move: function( move_num, cur_ibtn_index ) {
            if( this.LENGTH <= this.opt.moveNum ) {
                return;
            }
            
            if( this.LOCKED ) {
                return;
            }
            
            this.LOCKED = true;
            
            var _this = this, step = this.getStep( move_num, cur_ibtn_index );
            

            if( step === null ) {
                this.LOCKED = false;
                return;
            }
            
            this.opt.onBeforeInView.call( this.target, this.getInViewList() );
                
            this.setListState();
            this.setDirBtnState();

            this.setIndexBtnState( Math.abs( step / this.opt.step ) );
            
            var move_config = {};
            move_config[ this.opt.isHori ? "left": "top" ] = step;
            
            this.ELEM.cont.animate( move_config, this.opt.speed, function() {
                _this.LOCKED = false;
                
                _this.opt.onFinished.call( _this.target, _this.getInViewList() );
            });
        },
        
        /**
         * 移动数量，该参数有方向
         *  
         * @param {Number} move_num
         * 
         */
        getStep: function( move_num ) {
            var to_index = move_num !== undefined ? ( this.I + move_num ) : this.I;
            
            // 到达最小边界位置
            if( to_index < 0 ) {
                
                if( this.opt.loop ) {
                    to_index = this.LENGTH + to_index - this.opt.moveNum;
                    // this.ELEM.cont.css( this.opt.isHori ? "left" : "top", ( move_num - to_index ) * this.opt.step );
                } 
                // 不循环则锁定到第一项
                else {
                    to_index = 0;
                }
            }
            // 到达最大边界位置
            if( to_index > this.LENGTH - this.opt.moveNum ) {
                
                if( this.opt.loop ) {
                    // to_index = Math.abs( this.LENGTH - to_index - this.opt.moveNum * 2 );
                    to_index = 0;
                    // this.ELEM.cont.css( this.opt.isHori ? "left" : "top", ( move_num - to_index ) * this.opt.step );
                } 
                // 不循环则锁定到最后一项
                else {
                    to_index = this.LENGTH - this.opt.moveNum;
                }
            }
            
            if( move_num !== undefined && this.I === to_index ) {
                return null;
            }
            
            var step = to_index * this.opt.step * -1;
            
            this.I = to_index;
           
            return step;
        },
        
        /**
         * 自动播放
         *  
         */
        auto: function() {
            clearTimeout( this.autoTimer );
            
            var _this = this;
            
            this.autoTimer = setTimeout(function() {
                
                _this.move( 1 * _this.opt.moveNum );
                _this.auto();
                
            }, this.opt.autoDelay );
        },
        
        /**
         * 获取在显示区域内的元素列表
         *  
         */
        getInViewList: function() {
            var arr = [];
            
            for( var i = this.I; i < this.I + this.opt.moveNum; i ++ ) {
                arr.push( this.ELEM.cont.find( this.opt.itemsSelector ).eq( i )[0] );
            }
            
            return arr;
        },
        
        /**
         * 设置当前项
         *  
         */
        setListState: function() {
            this.ELEM.cont.find( this.opt.itemsSelector ).removeClass( this.opt.listCurClass );
            this.ELEM.cont.find( this.opt.itemsSelector ).eq( this.I ).addClass( this.opt.listCurClass );
        },
        
        /**
         * 设置方向按钮状态
         *  
         */
        setDirBtnState: function() {
            if( this.opt.loop ) {
                return;
            }
            
            this.ELEM.prev.removeClass( this.opt.lockedClass );
            this.ELEM.next.removeClass( this.opt.lockedClass );
                
            if( this.I <= 0 ) {
                this.ELEM.prev.addClass( this.opt.lockedClass );
            }
            if( this.I >= this.LENGTH - this.opt.moveNum ) {
                this.ELEM.next.addClass( this.opt.lockedClass );
            }
        },
        
        /**
         * 设置索引按钮样式
         *  
         * @param {Object} index
         * 
         */
        setIndexBtnState: function( index ) {
            if( this.opt.loop ) {
                //return;
            }
           
            // 按钮上的真实索引位
            var realIndex = Math.round( index / this.opt.moveNum ), orgBtns = this.ELEM.numbtn.find( "a" );
            
            orgBtns.removeClass( this.opt.ibtnCurClass );
            orgBtns.eq( realIndex ).addClass( this.opt.ibtnCurClass );
            
            // 存在关联按钮
            if( this.opt.relaBtns ) {
                this.opt.relaBtns.removeClass( this.opt.ibtnCurClass );
                this.opt.relaBtns.eq( realIndex ).addClass( this.opt.ibtnCurClass );
            }
            
        }
        
    };

    return droll;

});