var assert = require("mixins/Utils").assert;
var G = require("main/config");

/*
 * THE SCENER API:

   // Advance next scene
   scener.start(NextSceneConstructor);

   // Advance a temporary scene
   scener.push();

   // Leave a temporary scene
   scener.pop();

 * EXAMPLES:

   // Lalala start the main game
   scener.push(MainGameScene);

   // When pause is pressed
   scener.push(PauseMenu);
        
       // When controls is pressed
       scener.push(PauseControlsSubMenu);

       // When back is pressed
       scener.pop();
       
   // When back is pressed
   scener.pop();

 * MORE:
    push is exactly like start, but it saves the prior scene

*/
var Scener = function(game) {
    this.stack = [];
    this.game = game;
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
    this.stack.push(new Builder(scene, this.game, settings));
};

Scener.prototype.pop = function() {
    assert("Cannot pop without a previous scene", this.stack.length);
    this.stack.pop();
};

Scener.prototype.update = function(delta) {

    // Save quick refs
    var stack = this.stack;
    
    // Get most recent scene
    var cur = stack[stack.length - 1];

    // Build the scene if necessary
    if (cur instanceof Builder) {
        stack[stack.length - 1] = cur = cur.build();
    }

    if (cur.active()) {
        cur.update(delta);
        assert("A scene can only change scenes in exit()", 
                cur == stack[stack.length - 1]);
    } else {
        cur.exit();
        assert("An inactive scene must change scenes in exit()",
                cur != stack[this.stack.length - 1]);
    }
};

var Builder = function(ctor, game, settings) {
    this.ctor = ctor; 
    this.game = game; 
    this.settings = settings; 
}

var doNothing = function() {};
var getTrue = function() { return true; };

Builder.prototype = {
    build: function() {
        var s = new this.ctor(this.game, this.settings);

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
        return s;
    }
}

module.exports = Scener;
