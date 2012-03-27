/*
 * Store states and throw events when modified.
 */
var events = require("events");
    util = require("util");

function State() {
    this.data = {};
};

util.inherits(State, events.EventEmitter);

State.prototype.set = function(key, value) {
    this.data[key] = value;
    this.emit('set', key, value);
};

State.prototype.get = function(key) {
    return this.data.get(key);
};

State.prototype.as_json = function() {
    return JSON.stringify(this.data);
};

exports.State = State;
