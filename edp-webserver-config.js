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
            location: /\.jsx?($|\?)/,
            handler: [
                function (context) {
                    var pathname = context.request.pathname;
                    if (/\.jsx\.js$($|\?)/.test(pathname)) {
                        pathname = pathname.replace(/\.js$/, '');
                    }
                    var file = path.join(context.conf.documentRoot, pathname);
                    if (fs.existsSync(file)) {
                        context.header['content-type'] = mime.lookup('js');
                        context.content = fs.readFileSync(file, 'utf8');
                    }
                },
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
