/**
 * @file 瀑布流组件React版
 * @author Yao Chang(yaochang@baidu.com)
 * @date 2015-7-27
 */

define(function (require) {

    var $ = require('zepto');
    var utils = require('utils');
    var React = require('react');

    var Waterfall = React.createClass({

        /**
         * 计算滚动位置是否到达瀑布流容器的底部
         *
         * @return {boolean} true/false 返回是否可以加载
         */
        caniload: function () {

            var scrollTop = $(window).scrollTop();
            var minColHeight = utils.getMin(this.state.colHeight).minHeight;
            // 比较最高列和最低列之差与200的大小，取最小值
            // 当滚动条滚动位置与最小列高度之差大于refer值，就可以启动加载更多
            var refer = Math.min(this.state.wfHeight - minColHeight, 200);
            if (this.state.screenHeight + scrollTop - (this.state.wfOffsetTop + minColHeight) >= refer) {
                return true;
            }
            return false;
        },

        /**
         * 加载更多卡片
         */
        load: function () {

            var self = this;
            self.setState({
                isLoading: true
            });

            $.get(
                this.props.url,
                {
                    page: this.state.page,
                    limit: this.props.limit
                },
                function (data) {
                    data = JSON.parse(data);
                    if (data.errno === 0) {
                        self.dispatchCards(data.dataset);
                    }
                    else if (data.errno === 1001) {
                        self.setState({
                            isLoading: false,
                            isOver: true
                        });
                        alert('已经加载完啦，没有更多图片啦！');
                    }
                }
            );
        },

        /**
         * 加载一批卡片，一般来说一张卡片中包含一张大图
         * 这里主要是预加载卡片中的图片
         * 所有图片预加载完成以后再渲染所有卡片
         *
         * @param {Array.<Object>} dataList 卡片信息数组
         */
        dispatchCards: function (dataList) {

            var imgs = [];
            for (var i = 0; i < dataList.length; i++) {
                var img = new Image();
                img.src = dataList[i].imgSrc;
                img.alt = dataList[i].tag[0];
                img.className = 'waterfall-img';
                imgs.push(img);
            }

            var self = this;

            utils.imagesLoaded(imgs, function (imgs) {

                // 计算瀑布流每一列应该放哪些卡片，并且更新各列高度
                self.calColumns(dataList, imgs);

                // 更新状态 触发渲染
                self.setState({
                    page: self.state.page + 1,
                    isLoading: false,
                    wfHeight: utils.getMax(self.state.colHeight).maxHeight
                });
            });
        },

        /**
         * 计算每张卡片应该放在哪一列
         * 维护一个列信息数组和列高度数组
         *
         * @param {Array.<Object>} dataList 卡片信息数组
         * @param {HTMLImageElement} imgs 图片DOM
         */
        calColumns: function (dataList, imgs) {

            var state = this.state;

            for (var i = 0, len = dataList.length; i < len; i++) {
                var minIndex = utils.getMin(state.colHeight).minIndex;
                if (!state.columns[minIndex]) {
                    state.columns[minIndex] = [dataList[i]];
                }
                else {
                    state.columns[minIndex].push(dataList[i]);
                }

                state.colHeight[minIndex] += imgs[i].height / imgs[i].width * state.colWidth
                                            + parseInt(this.props.gutterHeight, 10);
            }
        },

        /**
         * 渲染所有列
         *
         * @return {jsx} columns 所有列的jsx
         */
        renderColumns: function () {

            if (this.state.columns.length === 0) {
                return null;
            }

            var columns = this.state.columns.map(this.renderColumn);

            return columns;

        },

        /**
         * 渲染一列
         *
         * @param {Array.<Object>} column 列信息数组
         * @param {number} index 列索引
         * @return {jsx} column 一列的jsx
         */
        renderColumn: function (column, index) {
            var self = this;
            var arr = column.map(function (card) {
                return (
                    <a href={card.bingourl}
                        className="waterfall-card"
                        target="_blank"
                        style={{marginBottom: self.props.gutterHeight + 'px'}}>
                        <img className="waterfall-img" src={card.imgSrc} alt={card.tag[0]} />
                    </a>
                );
            });

            var paddingLeft = index === 0 ? this.props.gutterWidth : 0;
            var paddingRight = this.props.gutterWidth;

            return (
                <div className="waterfall-col"
                    style={{
                        width: this.state.colWidth + 'px',
                        paddingLeft: paddingLeft + 'px',
                        paddingRight: paddingRight + 'px'
                    }}>
                    {arr}
                </div>
            );
        },

        /**
         * 判断是否渲染『正在加载』元素
         *
         * @return {jsx} jsx/null 正在加载元素jsx或者null
         */
        renderLoading: function () {
            if (this.state.isLoading) {
                return (
                    <div className="waterfall-loading clearfix">
                        <i></i>&nbsp;正在加载，请稍候
                    </div>
                );
            }
            return null;
        },

        /**
         * 官方函数，首次渲染前触发，用于设置state初始值
         *
         * @return {Object} state 状态
         */
        getInitialState: function () {
            var self = this;
            return {
                // 请求页码
                page: 1,
                // 二维数组，用于记录哪一列该放哪些图片
                columns: [],
                // 存储每一列的高度
                colHeight: (function () {
                    var arr = [];
                    for (var i = 0, len = self.props.colNum; i < len; i++) {
                        arr[i] = 0;
                    }
                    return arr;
                })(),
                // 列宽
                colWidth: (function () {
                    var wfWidth = document.getElementsByClassName('content')[0].offsetWidth;
                    var gutterWidth = parseInt(self.props.gutterWidth, 10);
                    var colWidth = (wfWidth - (self.props.colNum + 1) * gutterWidth) / self.props.colNum;
                    return colWidth;
                })(),
                // 是否正在加载
                isLoading: false,
                // 所有图片是否已经全部加载完毕
                isOver: false,
                // 瀑布流在页面中的位置，y方向
                wfOffsetTop: (function () {
                    return $('.content').offset().top;
                })(),
                wfHeight: 0,
                // 屏幕高度
                screenHeight: (function () {
                    return $(window).height();
                })()
            };
        },

        /**
         * 官方函数，在初始化渲染之后立即执行一次
         * 使用setInterval设置每隔100ms执行一次判断
         * 符合条件执行『加载更多』
         * 不使用绑定滚动事件或者touch事件，适配PC端和移动端，简单
         */
        componentDidMount: function () {

            var self = this;

            setInterval(function () {
                if (self.caniload() && !self.state.isLoading && !self.state.isOver) {
                    self.load();
                }
            }, 100);
        },

        /**
         * 官方函数，将jsx转为实际DOM
         *
         * @return {jsx} jsx 瀑布流container的jsx
         */
        render: function () {
            return (
                <div className="waterfall-container clearfix">
                    {this.renderColumns()}
                    {this.renderLoading()}
                </div>
            );
        }
    });

    return Waterfall;
});
