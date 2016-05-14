var Utils = require('mixins/Utils');
var Base = require("mixins/Wave");
var TextBox = require("world/hud/TextBox");
var Global = require("main/config");
var Timer = require('engine/Timer');

// A transition is just a simple object which adheres to the scene interface
// (see the scene skeleton.js). 
var Transition = function(game, settings) {
    Utils.assert("Transition requires a next scene", 
            "nextScene" in settings);

    var defaults = {
        duration: 1000,
        message: "blah blah"
    }

    Utils.extend(this, Utils.extend(defaults, settings));
    Utils.extend(this, Base, ["destroyExcept"]);
    this.game = game;
    this.c = game.c;
};

Transition.prototype = {
    init: function() {
        // define what happens at beginning
        this.c.renderer.setBackground('#000');
        this.timer = new Timer();
        this.c.entities.create(TextBox, {
            text: this.sceneName, 
            color: "#fff",
            x: Global.Game.width / 2,
            y: Global.Game.height / 2,
            align: "center"
        }).draw(this.c.renderer.getCtx());
    },
    active:function() {
        // return true if scene is active
        return this.timer.getTime() < this.duration;
    },
    update:function(delta) {
        this.timer.update(delta);
    },
    exit: function() {
        this.destroyExcept(/* destroy everything */);
        this.c.renderer.setBackground(Global.Game.color);
        this.game.scener.start(this.nextScene);
    }
};

module.exports = Transition;
