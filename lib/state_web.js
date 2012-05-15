/**
 * Expose states as a web page : static and server events.
 */

var fs = require('fs');

exports.register = function(router, state) {
    router.route(/^\/events/, function(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
        'X-Accel-Buffering': 'no'});
        var write_event = function(evt) {
            res.write('data: ');
            res.write(evt);
            res.write('\r\n\r\n');
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
};
