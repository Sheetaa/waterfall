var Waterfall = React.createClass({displayName: "Waterfall",

    getArray: function(obj, num) {
        var arr = [];
        for (var i = 0; i < num; i++) {
            arr[i] = obj;
        }
        return arr;
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {

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
    React.createElement(Waterfall, {colNum: "3"}),
    document.getElementsByClassName('content')[0]
);
