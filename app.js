var http = require('http'),
    net = require('net'),
    State = require('./lib/state').State;

var state = new State();

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(state.as_json());
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

var server = net.createServer(function(c) { //'connection' listener
    c.on('end', function() {
        console.log('server disconnected');
    });
    c.on('data', function(data) {
        var match = /(\w+) (\w+)\s?/.exec(data.toString())
        var v = match[2];
        var vv = parseInt(v, 10);
        if(! isNaN(vv)) v = vv;
        state.set(match[1], v);
    });
});
server.listen(8124, function() { //'listening' listener
    console.log('server bound');
});
