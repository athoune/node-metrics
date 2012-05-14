var http = require('http'),
    net = require('net'),
    Router = require('./lib/router').Router,
    State = require('./lib/state').State,
    tcp_socket = require('./lib/input/tcp_socket'),
    Stats = require('./lib/proc/stats').Stats,
    Vapor = require('./lib/output/vapor.js').Vapor,
    statics = require('./lib/statics.js'),
    state_web = require('./lib/state_web.js');

process.title = 'metricsd';

function conf(key, defaultValue) {
    return process.env[key] | defaultValue;
}

var state = new State();
state.setMaxListeners(200);

var stats = new Stats(state);
stats.start();

var server = http.createServer();
var router = new Router(server);

var vapor = new Vapor(state, router);
vapor.start();

state_web.register(router, state);

statics.register(router);

server.listen(
    conf('METRICS_HTTP_PORT', 1337),
    conf('METRICS_HTTP_HOST', 'localhost'));

tcp_socket.createServer(state,
    conf('METRICS_SOCKET_PORT', 8124),
    conf('METRICS_SOCKET_HOST', 'localhost'));
