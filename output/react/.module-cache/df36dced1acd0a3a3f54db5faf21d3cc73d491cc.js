var Waterfall = React.createClass({displayName: "Waterfall",

    load: function(ajaxConf) {

        var me = this

        $.get(
            ajaxConf.url,
            {
                page: ajaxConf.page,
                limit: ajaxConf.limit
            }
        ).done(function (data) {

            if (data.errno === 0) {
                dispatchCards(data.dataset);
            }

        });
    },

    dispatchCards: function(dataList) {

        var imgs = [];
        for (var i = 0; i < dataList.length; i++) {
            var img = new Image();
            img.src = dataList[i].imgSrc;
            img.alt = dataList[i].tag[0];
            img.className = 'waterfall-img';
            img.style.width = '100%';
            img.style.height = 'auto';
            imgs.push(img);
        }

        var self = this;

        utils.imagesLoaded(imgs, function (imgs) {
            // 计算瀑布流每一列应该放哪些卡片，并且更新各列高度
            var status = calColumns(imgs, self.state);

            // 更新状态 触发渲染
            self.setState({
                page: page + 1,
                colHeight: status.colHeight,
                columns: status.columns
            });
        });
    },

    calColumns: function (imgs, status) {
        imgs.forEach(function (img) {
            var minIndex = utils.getMin(status.colHeight).minIndex;
            if (!status.columns[minIndex]) {
                status.columns[minIndex] = [img];
            }
            else {
                status.columns[minIndex].push(img);
            }
            status.colHeight[minIndex] += img.height + this.props.gutterHeight;
        });
        return status;
    },

    renderColumns: function () {

        if (this.columns.length === 0) {
            return null;
        }

        return this.columns.map(this.renderColumn);

    },

    renderColumn: function (column) {
        return column.map(function (card) {
            return (
                React.createElement("a", {href: card.bingourl, className: "waterfall-card", target: "_blank"}, 
                    React.createElement("img", {className: "waterfall-img", src: card.imgSrc, alt: card.tag[0]})
                )
            );
        });
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return nextState.page !== this.state.page;
    },

    getInitialState: function () {
        return {
            page: 1,
            // 二维数组，用于记录哪一列该放哪些图片
            columns: [],
            // 存储每一列的高度
            colHeight: (function () {
                var arr = [];
                for (var i = 0, len = this.props.colNum; i < len; i++) {
                    arr[i] = 0;
                }
                return arr;
            })()
        };
    },

    componentDidMount: function () {
        this.load({
            url: this.props.url,
            page: this.state.page,
            limit: this.props.limit
        });
    },

    render: function () {
        return (
            React.createElement("div", {className: "waterfall-container clearfix"}, 
                this.renderColumns(), 
                React.createElement("div", {className: "waterfall-loading clearfix"}, 
                    React.createElement("i", null), " 正在加载，请稍候"
                )
            )
        );
    }
});

React.render(
    React.createElement(Waterfall, {colNum: "3", 
                url: "/bdbox/hot", 
                limit: "30", 
                gutterHeight: "10"}
    ),
    document.getElementsByClassName('content')[0]
);
