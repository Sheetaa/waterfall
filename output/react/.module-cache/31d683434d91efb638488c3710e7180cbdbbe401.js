var arr = [];

for (var i = 0, len = this.props.colNum; i < len; i++) {
    arr[i] = React.createElement("div", {class: "waterfall-col"});
}

var Waterfall = React.createClass({displayName: "Waterfall",



    render: function () {
        return (
            React.createElement("div", {className: "waterfall-container clearfix"}, 
                arr, 
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
