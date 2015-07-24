/**
 * @file Waterfall瀑布流组件
 * @author Yao Chang(yaochang@baidu.com)
 * @date 2015-7-21
 */

define(function (require) {
    var $ = require('./zepto');
    var utils = require('./utils');

    // 用户可配置参数
    var defaultOptions = {
        prefix: 'waterfall',
        colNum: 3,
        gutterWidth: 10,
        gutterHeight: 10,
        resizable: false,
        // 节流阀间隔时间
        interval: 500,
        // 即将绑定在scroll事件上的回调函数列表
        callbackList: [loadMore],
        // 异步请求相关参数
        ajaxConf: {
            method: 'POST',
            url: '',
            // 一次加载多少张卡片
            limit: 30
        }
    };

    // 布局参数
    var $wfContainer;
    var $wfCol;
    var $wfLoading;
    var wfOffset;
    var wfWidth;
    var wfHeight;
    var colWidth;

    // 计算相关参数
    var isLoading;
    var isAllLoaded;
    var page;
    var colHeight = [];
    var map = {
        up: {},
        down: {}
    };

    /**
     * 加载更多
     *
     * @param {number} num 加载卡片的个数
     */
    function loadMore(num) {
        if (caniload() && !isLoading && !isAllLoaded) {
            isLoading = true;
            $wfLoading.show();
            var ajaxConf = defaultOptions.ajaxConf;
            num = num || ajaxConf.limit;
            $.ajax({
                type: ajaxConf.method,
                url: ajaxConf.url,
                data: {
                    page: page,
                    limit: num
                },
                dataType: 'json',
                success: function (data) {
                    if (data.errno === 0) {
                        page++;
                        dispatchCards(data.dataset);
                    }
                    else if (data.errno === 1001) {
                        isAllLoaded = true;
                        alert('没有更多卡片啦');
                    }
                },
                complete: function () {
                    isLoading = false;
                    $wfLoading.hide();
                }
            });
        }
    }

    /**
     * 计算滚动位置是否到达瀑布流容器的底部
     *
     * @return {boolean} true/false 返回是否可以加载
     */
    function caniload() {
        // 首次加载更多，不需要判断
        if (wfHeight === 0) {
            return true;
        }

        var screenHeight = $(window).height();
        var scrollTop = $(window).scrollTop();
        var minColHeight = utils.getMin(colHeight).minHeight;
        // 比较最高列和最低列之差与200的大小，取最小值
        // 当滚动条滚动位置与最小列高度之差大于refer值，就可以启动加载更多
        var refer = Math.min(wfHeight - minColHeight, 200);
        if (screenHeight + scrollTop - (wfOffset + minColHeight) >= refer) {
            return true;
        }
        return false;
    }

    /**
     * 加载一批卡片，一般来说一张卡片中包含一张大图
     * 这里主要是预加载卡片中的图片
     * 所有图片预加载完成以后再渲染所有卡片
     *
     * @param {Array.<Object>} cardList 卡片信息数组
     */
    function dispatchCards(cardList) {
        // imgs 图片DOM数组
        var imgs = [];
        for (var i = 0; i < cardList.length; i++) {
            var img = new Image();
            img.src = cardList[i].imgSrc;
            img.alt = cardList[i].tag[0];
            img.className = 'waterfall-img';
            img.style.width = '100%';
            img.style.height = 'auto';
            imgs.push(img);
        }
        utils.imagesLoaded(imgs, function (imgs) {
            for (var i = 0, len = cardList.length; i < len; i++) {
                var minIndex = utils.getMin(colHeight).minIndex;
                var curCol = $wfCol.get(minIndex);
                render(curCol, imgs[i], cardList[i], minIndex);
            }

            console.log(map);

            isLoading = false;
            $wfLoading.hide();
        });
    }

    /**
     * 渲染一个卡片
     *
     * @param {HTMLElement} col 瀑布流单列的DOM节点
     * @param {HTMLImageElement} img 图片DOM
     * @param {Object} itemData 卡片相关数据
     * @param {string} itemData.imgType 图片格式
     * @param {string} itemData.imgSrc 图片地址
     * @param {string} itemData.bingourl 图片对应的单图结果页URL
     * @param {Array.<string>} itemData.tag 图片对应的tag数组
     * @param {number} minIndex 最小高度列的索引
     */
    function render(col, img, itemData, minIndex) {
        // 如果图片加载出错，则设置默认图片高度
        if (!img.height) {
            img.style.height = '200px';
        }
        var a = document.createElement('a');
        a.href = itemData.bingourl;
        a.appendChild(img);
        a.target = '_blank';
        a.style.marginBottom = defaultOptions.gutterHeight + 'px';
        a.className = 'waterfall-card animated flipInY';
        $(a).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function () {
                $(this).removeClass('animated flipInY');
            }
        );

        var tagList = itemData.tag;
        if (tagList && tagList.length !== 0) {
            var p = document.createElement('p');
            p.className = 'waterfall-card-tag';
            var em;
            for (var i = 0, length = tagList.length; i < length; i++) {
                em = document.createElement('em');
                em.className = 'waterfall-card-tag-item';
                em.innerHTML = tagList[i];
                p.appendChild(em);
            }
            a.insertBefore(p, img);
        }
        col.appendChild(a);

        updateMap(a);
        colHeight[minIndex] += a.offsetHeight + defaultOptions.gutterHeight;
        wfHeight = utils.getMax(colHeight).maxHeight;
    }

    function scroll() {
        var screenHeight = $(window).height();
        var preScrollTop = 0;
        var curScrollTop = 0;
        return function () {
            curScrollTop = $(window).scrollTop();
            if (curScrollTop > preScrollTop) {
                for (var key in map.up) {
                    if (map.up.hasOwnProperty(key)) {
                        if (key > screenHeight + curScrollTop - 50
                            && key < screenHeight + curScrollTop)
                        {
                            if (!isAnimating) animatejs(map.up[key]);
                        }
                    }
                }
            }
            else if (curScrollTop < preScrollTop) {
                for (var key in map.down) {
                    if (map.down.hasOwnProperty(key)) {
                        if (key > curScrollTop - 50
                            && key < curScrollTop)
                        {
                            if (!isAnimating) animatejs(map.down[key]);
                        }
                    }
                }
            }
            preScrollTop = curScrollTop;
        };
    }

    function updateMap(card) {
        var offsetUp = wfOffset + utils.getMin(colHeight).minHeight;
        var offsetDown = offsetUp + card.offsetHeight;
        if (!map.up[offsetUp]) {
            map.up[offsetUp] = [card];
        }
        else {
            map.up[offsetUp].push(card);
        }
        if (!map.down[offsetDown]) {
            map.down[offsetDown] = [card];
        }
        else {
            map.down[offsetDown].push(card);
        }
    }

    /**
     * 使卡片动起来
     *
     * @param {HTMLElement} card 卡片DOM元素
     */
    function animate(cardList) {
        cardList.forEach(function (value) {
            $(value).addClass('animated flipInY')
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                function () {
                    $(this).removeClass('animated flipInY');
                }
            );
        });

    }

    var duration = 1000;
    var startTime;
    var isAnimating = false;
    function animatejs(cardList) {
        isAnimating = true;
        startTime = new Date();
        cardList.forEach(function (card) {
            card.style.webkitTransform = 'rotate3d(0, 1, 0, 90deg)';
        });
        requestAnimationFrame(timeHandler.bind(null, cardList));
    }

    function timeHandler() {
        var timePast = new Date() - startTime;
        if (timePast >= duration) {
            tick(1);
            isAnimating = false;
        }
        else {
            var cardList = arguments[0];
            tick(timePast / duration, cardList);
            requestAnimationFrame(timeHandler.bind(null, cardList));
        }
    }

    function tick(percent, cardList) {
        var angle = 90 * (1 - percent);
        cardList.forEach(function (card) {
            card.style.webkitTransform = 'rotate3d(0, 1, 0, ' + angle + 'deg)';
        });
    }

    /**
     * 初始化瀑布流
     *
     * @param {Object} options 用户输入的配置参数
     */
    function init(options) {

        // 初始化用户可配置参数
        utils.extend(defaultOptions, options);

        // 初始化布局参数
        $wfContainer = $('.waterfall-container');
        $wfCol = $wfContainer.find('.waterfall-col');
        $wfLoading = $wfContainer.find('.waterfall-loading');
        wfOffset = $wfContainer.offset().top;
        // 在没有设置waterfall-container宽度的时候
        // 滚动条会占据宽度的一部分，导致宽度计算不准确
        // 所以减去滚动条的宽度15px
        // wfWidth = $wfContainer.width() - 15;
        wfWidth = $wfContainer.width();
        wfHeight = 0;
        colWidth = (wfWidth - (defaultOptions.colNum + 1) * defaultOptions.gutterWidth) / defaultOptions.colNum;
        $wfCol.css({
            width: colWidth,
            paddingLeft: defaultOptions.gutterWidth / 2,
            paddingRight: defaultOptions.gutterWidth / 2
        });
        $wfCol.first().css({
            paddingLeft: defaultOptions.gutterWidth
        });
        $wfCol.last().css({
            paddingRight: defaultOptions.gutterWidth
        });

        // 初始化计算相关参数
        isAllLoaded = false;
        isLoading = false;
        page = 1;
        for (var i = 0, len = defaultOptions.colNum; i < len; i++) {
            colHeight[i] = 0;
        }

        // 处理window scroll事件
        var throttled = utils.throttle(defaultOptions.callbackList, defaultOptions.interval);
        $(window).on('scroll', throttled);
        var scrollFn = scroll();
        $(window).on('scroll', scrollFn);
        // setInterval(scrollFn, 20);
        // window.onscroll = scrollFn;
        // document.documentElement.removeEventListener('touchmove', scrollFn);
        document.documentElement.addEventListener('touchmove', scrollFn);
        // document.documentElement.addEventListener('touchmove', loadMore);

        // var scrollFn = function () {
        //     $('.log').html($(window).scrollTop());
        // };

        // 加载首屏瀑布流内容
        loadMore();
    }

    return {
        init: init
    };
});
