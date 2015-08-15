var Base = require("mixins/Wave");
var Global = require("main/config");
var Player = require("world/player/Player");
var R = require("mixins/Random");
var Settings = require("./config");
var Simple = require("world/enemy/Simple/Simple");
var TextBox = require("world/hud/TextBox");
var Transition = require("world/scenes/waves/transition");
var Timer = require("engine/Timer");
var Utils = require("mixins/Utils");

var Scene = Settings.Scene;

var PreWave = function(game) {
    return new Transition(game, {
        duration: 1000,
        sceneName: "Wave 1",
        nextScene: Wave
    });
};

var Wave = function (game, settings) {
    this.c = game.c;
    this.game = game;
    this.timer = new Timer();

    this.base = Utils.bind(this, Base);
    Utils.extend(this, Base, ["destroyExcept"]);
};

Wave.prototype = {};
Wave.prototype.init = function() {
    // define what happens at beginning

    this.timer = new Timer();
    var make = Utils.atMost(Scene.MAX_SIMPLE, makeSimple.bind(this));
    make();
    this.timer.every(Scene.spawnDelay, make); 
    this.c.entities.create(Player, Settings.Player);
    this.scoreBox = this.c.entities.create(TextBox, {
        font: '30pt Verdana',
        x: 15, y: 45, 
        text: this.game.scorer.get(),
    });
};
Wave.prototype.active = function() {
    // Exit if key R(eset) is pressed
    // or player is dead
    return this.base.active();
};
Wave.prototype.update = function(delta) {
    this.timer.update(delta);

    // Update score 
    this.scoreBox.text = this.game.scorer.get();

    var playerAlive = this.c.entities.all(Player).length;

    if (!playerAlive && !this.game.pauser.isPaused()) {

        this.textBox = this.c.entities.create(TextBox, {
            text: "Press R to restart", 
            x: Global.Game.width / 2,
            y: 0.4 * Global.Game.height,
            align: "center"
        }).draw(this.c.renderer.getCtx());

        this.game.pauser.pause();
    }            

};
Wave.prototype.exit = function() {
    var self = this;
    var game = this.game;
    var destroy = this.c.entities.destroy.bind(this.c.entities);

    this.destroyExcept(/* destroy everything */);

    game.scorer.reset();
    if (game.pauser.isPaused())
        game.pauser.unpause();
    game.scener.start(PreWave);
};

var makeSimple = function () {
    var center = { x: 0, y: 0 };

    if (R.bool()) {
        center.x = R.bool() ? Global.Game.width : 0;
        center.y = R.scale(Global.Game.height);
    } else {
        center.y = R.bool() ? Global.Game.height : 0;
        center.x = R.scale(Global.Game.width);
    }

    this.c.entities.create( Simple, 
            Utils.extend({ center: center }, Settings.Simple));

};

module.exports = PreWave;
