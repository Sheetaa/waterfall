var Waterfall = React.createClass({displayName: "Waterfall",
    render: function () {
        return (
            React.createElement("div", {className: "waterfall-container clearfix"}, 
                React.createElement("div", {className: "waterfall-loading clearfix"}, 
                    React.createElement("i", null), " 正在加载，请稍候"
                )
            )
        );
    }
});

React.render(React.createElement(Waterfall, null), document.getElementsByClassName('content')[0]);
