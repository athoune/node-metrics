var http = require('http'),
    net = require('net'),
    fs = require('fs'),
    Router = require('./lib/router').Router,
    State = require('./lib/state').State,
    tcp_socket = require('./lib/input/tcp_socket');

process.title = 'metricsd';

function conf(key, defaultValue) {
    return process.env[key] | defaultValue;
}

var state = new State();
state.setMaxListeners(200);

var server = http.createServer();
var router = new Router(server);
router.route(/^\/events/, function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
    'X-Accel-Buffering': 'no'});
    var write_event = function(evt) {
        res.write('data: ');
        res.write(evt);
        res.write("\r\n\r\n");
    };
    write_event(state.as_json());
    state.on('set', function(key, value) {
        var r = {};
        r[key] = value;
        write_event(JSON.stringify(r));
    });
});
router.route(/^\/data/, function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(state.as_json());
});
router.route(/^\/$/, function(req, res) {
    fs.readFile('./www/index.html', function(err, data) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
});

var mimetypes = {
    js: 'application/javascript',
    css: 'text/css',
    png: 'image/png'
};

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
server.listen(
    conf('METRICS_HTTP_PORT', 1337),
    conf('METRICS_HTTP_HOST', 'localhost'));

tcp_socket.createServer(state,
    conf('METRICS_SOCKET_PORT', 8124),
    conf('METRICS_SOCKET_HOST', 'localhost'));
