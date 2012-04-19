var fs = require('fs'),
    os = require('os');

function Stats(state) {
    this.state = state;
}

exports.Stats = Stats;

Stats.prototype.readProc = function(cb) {
    fs.readFile('/proc/stat', 'utf8', function(err, data) {
        if (err) throw err;
        results = {};
        data.split('\n').forEach(function(line) {
            var values = line.split(/\s+/);
            var key = values.splice(0, 1)[0];

            if (key.substring(0, 3) == 'cpu') {
                values = values.map(function(a) {
                    return parseInt(a, 10);
                });
                results[key] = values;
            }
        });
        cb.call(this, results);
    });
};

Stats.prototype.avg = function(cb) {
    var that = this;
    this.readProc(function(stats) {
        setTimeout(function(aa) {
            that.readProc(function(bb) {
                var a = aa.cpu;
                var b = bb.cpu;
                var load = 100 * ((b[0] + b[1] + b[2]) - (a[0] + a[1] + a[2])) /
                    ((b[0] + b[1] + b[2] + b[3]) - (a[0] + a[1] + a[2] + a[3]));
                cb(load);
            });
        }, 1000, stats);
    });
};

Stats.prototype.loop = function(cb) {
    this.avg(cb);
    var that = this;
    setInterval(function() {
       that.avg(cb);
    }, 10000);
};

Stats.prototype.start = function() {
    var that = this;
    if (os.platform() === 'linux') {
        console.log('plugin: proc/stat')
        this.loop(function(load) {
            for (c in load) {
                that.state.set('proc.stat.cpu.' + c, load(c));
            }
        });
    }
};

