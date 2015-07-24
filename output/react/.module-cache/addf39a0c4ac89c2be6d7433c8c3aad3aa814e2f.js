var Waterfall = React.createClass({displayName: "Waterfall",

    aaa: function () {
        var arr = [];

        for (var i = 0, len = this.props.colNum; i < len; i++) {
            arr[i] = React.createElement("div", {class: "waterfall-col"});
        }
        return arr;
    },

    render: function () {
        return (
            React.createElement("div", {className: "waterfall-container clearfix"}, 
                aaa(), 
                React.createElement("div", {className: "waterfall-loading clearfix"}, 
                    React.createElement("i", null), " 正在加载，请稍候"
                )
            )
        );
    }
});

React.render(
    React.createElement(Waterfall, {colNum: "3"}),
    document.getElementsByClassName('content')[0]
);
