var assert = require("mixins/Utils").assert;
var G = require("main/config");

var Scener = function(game) {
    this.stack = [];
    this.game = game;
    this.cur;
}

Scener.prototype.start = function(scene, settings) {
    // Pop will throw an err if length is 0,
    // this check ensures that calls to start never throw the error 
    // (calling start for the first time) 
    // while user errors (calling pop too many times) are raised
    if (this.stack.length) 
        this.pop();
    this.push(scene, settings);
};

Scener.prototype.push = function(scene, settings) {
    var s = new scene(this.game, settings);

    // Provide defaults for necessary functions
    ["init", "active", "update", "exit"].forEach(function(func) {
        if (func in s)
            return;

        if (func == "active")
            s[func] = getTrue;
        else
            s[func] = doNothing;
    });

    s.init();
    this.stack.push(s);
};

Scener.prototype.pop = function() {
    assert("Cannot pop without a previous scene", this.stack.length);
    this.stack.pop();
};

Scener.prototype.update = function(delta) {

    // Save quick refs
    var cur, stack = this.stack;
    
    // Update current scene
    cur = this.cur = stack[stack.length - 1];

    if (cur.active()) {
        cur.update(delta);
        assert("A scene must change scenes in exit()", 
                cur == stack[stack.length - 1]);
    } else {
        cur.exit();
        assert("An inactive scene must change scenes in exit()",
                cur != stack[this.stack.length - 1]);
    }
};

var doNothing = function() {};
var getTrue = function() { return true; };

module.exports = Scener;
