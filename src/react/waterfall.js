/**
 * @file 瀑布流组件React版
 * @author Yao Chang(yaochang@baidu.com)
 * @date 2015-7-27
 */

var Waterfall = React.createClass({

    caniload: function() {

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

    load: function() {

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

    dispatchCards: function(dataList) {

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
            var status = self.calColumns(dataList, imgs, self.state);

            // 更新状态 触发渲染
            self.setState({
                page: status.page + 1,
                columns: status.columns,
                colHeight: status.colHeight,
                isLoading: false,
                wfHeight: utils.getMax(self.state.colHeight).maxHeight
            });
        });
    },

    calColumns: function (dataList, imgs, status) {

        for (var i = 0, len = dataList.length; i < len; i++) {
            var minIndex = utils.getMin(status.colHeight).minIndex;
            if (!status.columns[minIndex]) {
                status.columns[minIndex] = [dataList[i]];
            }
            else {
                status.columns[minIndex].push(dataList[i]);
            }

            status.colHeight[minIndex] += imgs[i].height / imgs[i].width * this.state.colWidth + parseInt(this.props.gutterHeight, 10);
        }
        return status;
    },

    renderColumns: function () {

        if (this.state.columns.length === 0) {
            return null;
        }

        var columns = this.state.columns.map(this.renderColumn);

        return columns;

    },

    renderColumn: function (column, index) {
        var self = this;
        var arr = column.map(function (card) {
            return (
                <a href={card.bingourl} className="waterfall-card" target="_blank" style={{marginBottom: self.props.gutterHeight + 'px'}}>
                    <img className="waterfall-img" src={card.imgSrc} alt={card.tag[0]} />
                </a>
            );
        });

        var paddingLeft = index === 0 ? this.props.gutterWidth : 0;
        var paddingRight = this.props.gutterWidth;

        return (
            <div className="waterfall-col" style={{width: this.state.colWidth + 'px', paddingLeft: paddingLeft + 'px', paddingRight: paddingRight + 'px'}}>
                {arr}
            </div>
        );
    },

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

    shouldComponentUpdate: function (nextProps, nextState) {
        // if (nextState.page !== this.state.page) {
        //     return false;
        // }
        return true;
    },

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
                var gutterWidth = parseInt(self.props.gutterWidth, 10)
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

    componentDidMount: function () {

        var self = this;

        setInterval(function () {
            if (self.caniload() && !self.state.isLoading && !self.state.isOver) {
                self.load();
            }
        }, 100);
    },

    render: function () {
        return (
            <div className="waterfall-container clearfix">
                {this.renderColumns()}
                {this.renderLoading()}
            </div>
        );
    }
});

React.render(
    <Waterfall colNum={3}
                url="/bdbox/hot"
                limit={20}
                gutterWidth={1}
                gutterHeight={1}
    />,
    document.getElementsByClassName('content')[0]
);
