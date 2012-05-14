var fs = require('fs');

var mimetypes = {
    js: 'application/javascript',
    css: 'text/css',
    png: 'image/png'
};

exports.register = function(router) {
    router.route(/^\/([a-zA-Z0-9\-]+)\.([a-z]{2,3})/, function(req, res, match) {
        var f = match[1];
        var ext = match[2];
        fs.readFile('./www/' + f + '.' + ext, function(err, data) {
            if (err) {
                res.writeHead(404);
            } else {
                res.writeHead(200, {'Content-Type' : mimetypes[ext]});
                res.end(data);
            }
        });
    });
};
