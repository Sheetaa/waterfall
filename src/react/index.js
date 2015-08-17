/**
 * @file index
 * @author Yao Chang(yaochang@baidu.com)
 *
 */

define(function (require) {

    var React = require('react');
    var Waterfall = require('waterfall.jsx');

    return {
        init: function () {
            React.render(
                <Waterfall
                    prefix="waterfall"
                    baseRefer={200}
                    colNum={3}
                    interval={100}
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
