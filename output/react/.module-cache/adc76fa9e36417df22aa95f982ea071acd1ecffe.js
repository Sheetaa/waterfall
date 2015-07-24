var Waterfall = React.createClass({displayName: "Waterfall",

    getArray: function(obj, num) {
        var arr = [];
        for (var i = 0; i < num; i++) {
            arr[i] = obj;
        }
        return arr;
    },

    load: function(ajaxConf) {
        $.get(
            ajaxConf.url,
            {
                page: ajaxConf.page,
                limit: ajaxConf.limit
            },
            function (data) {
                console.log(data);
            }
        );
    },

    getInitialState: function () {
        return {
            page: 1
        };
    },

    componentDidMount: function () {
        load({
            url: this.props.url,
            page: this.state.page,
            limit: this.props.limit
        });
    },

    render: function () {
        return (
            React.createElement("div", {className: "waterfall-container clearfix"}, 
                this.getArray(React.createElement("div", {className: "waterfall-col"}), this.props.colNum), 
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
                limit: "30"}
    ),
    document.getElementsByClassName('content')[0]
);
