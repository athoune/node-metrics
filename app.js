var http = require('http'),
    net = require('net'),
    State = require('./lib/state').State,
    tcp_socket = require('./lib/input/tcp_socket');

process.title = 'metricsd';

function conf(key, defaultValue) {
    return process.env[key] | defaultValue;
};

var state = new State();

http.createServer(function (req, res) {
    if(req.url === "/events") {
        res.writeHead(200, { 'Content-Type': 'text/event-stream'});
        var write_event = function(evt) {
            res.write('data: ');
            res.write(evt);
            res.write("\r\n\r\n");
        };
        write_event(state.as_json());
        state.on('set', function(key, value) {
            write_event(JSON.stringify({key:value}));
        });
    } else {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(state.as_json());
    }
}).listen(
    conf('METRICS_HTTP_PORT', 1337),
    conf('METRICS_HTTP_HOST', 'localhost'));

tcp_socket.createServer(state,
    conf('METRICS_SOCKET_PORT', 8124),
    conf('METRICS_SOCKET_HOST', 'localhost'));
