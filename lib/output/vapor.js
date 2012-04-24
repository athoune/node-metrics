/**
 * Store a small hitoy of values
 *
 */
var Vapor = function(state, router) {
    this.state = state;
    this.data = {};
    var that = this;
    router.route(/^\/vapor/, function(req, res) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        var values = {};
        for (var k in that.data) {
            values[k] = that.data[k].list;
        }
        res.end(JSON.stringify(values));
    });
};

exports.Vapor = Vapor;

var CappedList = function(max) {
    this.max = max;
    this.list = [];
};

CappedList.prototype.append = function(event_) {
    this.list.push([Date.now(), event_]);
    if(this.list.length > this.max) {
        this.list.pop();
    }
};

CappedList.prototype.filter = function(age) {

};

Vapor.prototype.start = function() {
    var that = this;
    this.state.on('set', function(key, value) {
        if(! that.data.hasOwnProperty(key)) {
            that.data[key] = new CappedList(100);
        }
        that.data[key].append(value);
    });
};
