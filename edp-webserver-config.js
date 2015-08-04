exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var transform = require('react-tools').transform;
var fs = require('fs');
var mime = require('mime');
var path = require('path');

exports.getLocations = function () {
    return [
        {
            location: /\/$/,
            handler: home( 'index.html' )
        },
        {
            // 处理后缀是.js和.jsx两种情况
            location: /\.jsx?($|\?)/,
            handler: [
                /**
                 * 读取文件内容
                 */
                function (context) {
                    var pathname = context.request.pathname;
                    if (/\.jsx\.js$($|\?)/.test(pathname)) {
                        // 如果后缀是.jsx.js，去掉.js
                        pathname = pathname.replace(/\.js$/, '');
                    }
                    var file = path.join(context.conf.documentRoot, pathname);
                    if (fs.existsSync(file)) {
                        context.header['content-type'] = mime.lookup('js');
                        context.content = fs.readFileSync(file, 'utf8');
                    }
                },
                /**
                 * 不论是.js还是.jsx，都进行jsx的transform转换
                 * 因为.js里也可能有jsx的语法
                 */
                function (context) {
                    context.content = transform(context.content);
                }
            ]
        },
        {
            location: function (req) {
                var pathname = req.pathname;
                var paths = [
                    '/bdbox/hot'
                ];
                for (var i = 0, len = paths.length; i < len; i++) {
                    if (new RegExp(paths[i]).test(pathname)) {
                        return true;
                    }
                }
                return false;
            },
            handler: [
                proxy('cp01-rdqa04-dev152.cp01.baidu.com', 8092)
            ]
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autocss()
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
