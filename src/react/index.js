define(function (require) {

    var React = require('react');
    var Waterfall = require('waterfall.jsx');

    return {
        init: function () {
            React.render(
                <Waterfall
                    colNum={3}
                    url="/bdbox/hot"
                    limit={20}
                    gutterWidth={1}
                    gutterHeight={1}
                />,
                document.getElementsByClassName('content')[0]
            );
        }
    };
});
