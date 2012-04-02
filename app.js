var http = require('http'),
    net = require('net'),
    State = require('./lib/state').State,
    tcp_socket = require('./lib/input/tcp_socket');

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
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

tcp_socket.createServer(state, 8124, 'localhost');
