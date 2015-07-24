var Waterfall = React.createClass({displayName: "Waterfall",

    load: function(ajaxConf) {

        var self = this

        $.get(
            ajaxConf.url,
            {
                page: ajaxConf.page,
                limit: ajaxConf.limit
            },
            function (data) {
                data = JSON.parse(data);
                if (data.errno === 0) {
                    self.dispatchCards(data.dataset);
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
            img.style.width = '100%';
            img.style.height = 'auto';
            imgs.push(img);
        }

        var self = this;

        utils.imagesLoaded(imgs, function (imgs) {

            // 计算瀑布流每一列应该放哪些卡片，并且更新各列高度
            var status = self.calColumns(imgs, self.state);

            // 更新状态 触发渲染
            self.setState({
                page: page + 1,
                columns: status.columns,
                colHeight: status.colHeight
            });
        });
    },

    calColumns: function (imgs, status) {
        var self = this;
        imgs.forEach(function (img) {
            var minIndex = utils.getMin(status.colHeight).minIndex;
            if (!status.columns[minIndex]) {
                status.columns[minIndex] = [img];
            }
            else {
                status.columns[minIndex].push(img);
            }
            status.colHeight[minIndex] += img.height + self.props.gutterHeight;
        });
        return status;
    },

    renderColumns: function () {

        if (this.state.columns.length === 0) {
            return null;
        }

        var columns = this.state.columns.map(this.renderColumn);

        return columns;

    },

    renderColumn: function (column) {
        return
            React.createElement("div", {className: "waterfall-col"}, 
            column.map(function (card) {
                return (
                    React.createElement("a", {href: card.bingourl, className: "waterfall-card", target: "_blank"}, 
                        React.createElement("img", {className: "waterfall-img", src: card.imgSrc, alt: card.tag[0]})
                    )
                );
            })
            );
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return nextState.page !== this.state.page;
    },

    getInitialState: function () {
        var self = this;
        return {
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
