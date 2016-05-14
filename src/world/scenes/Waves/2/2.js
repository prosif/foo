var Wall       = require("world/wall/Wall");
var Player     = require("world/player/Player");
var Micro      = require("world/enemy/Micro/Micro");
var Simple     = require("world/enemy/Simple/Simple");
var Bullet     = require("world/bullet/Bullet");
var Avoid      = require("world/enemy/Avoid/Avoider");
var TextBox    = require("world/hud/TextBox");
var Global     = require("main/config");
var Timer      = require("engine/Timer");
var Transition = require("world/scenes/waves/transition");
var Settings   = require("./config");
var R          = require("mixins/Random");
var Utils      = require("mixins/Utils");

var Scene = Settings.Scene;

var PreWave = function(game) {
    return new Transition(game, {
        sceneName: "Wave 2",
        nextScene: Wave
    });
};


var Wave = function (game) {
    this.c = game.c;
    this.game = game;
    this.timer = new Timer();
};

Wave.prototype = {
    init: function() {
        // define what happens at beginning
        var self = this;
        this.c.entities.create(Player, Settings.Player);

        // this.c.entities.create(Player, Settings.Player);
        this.scoreBox = this.c.entities.create(TextBox, {
            font: '30pt Verdana',
            x: 15, y: 45,
            text: this.game.scorer.get(),
        });
        var makeMicros = Utils.atMost(Scene.MAX_MICROS, makeMicro.bind(this));
        var makeSimples = Utils.atMost(Scene.MAX_SIMPLE, makeSimple.bind(this));
        var makeAvoiders = Utils.atMost(Scene.MAX_AVOIDERS, makeAvoider.bind(this));
        this.timer.every(Scene.spawnDelay, function() {
            makeMicros();
            makeSimples();
            makeAvoiders();
        }); 
        Wall.makeBoundaries(this);
    },
    active: function() {
        var I = this.c.inputter;
        return !I.isDown(I.R);
    },
    update: function(delta) {
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

    },
    exit: function() {
        var self = this;
        var game = this.game;
        var destroy = this.c.entities.destroy.bind(this.c.entities);
        // Destroy all created entities
        ([Player, Bullet, Simple, Avoid, TextBox, Micro, Wall]).forEach(function(type){
            self.c.entities.all(type).forEach(destroy);
        });
        game.scorer.reset();
        if (game.pauser.isPaused())
            game.pauser.unpause();
        game.scener.start(Wave);
    }
};

var makeSimple = function () {
    var self = this;
    if (self.c.entities.all().length >= Scene.MAX_ENEMIES)
        return;

    var center = { x: 0, y: 0 };

    if (R.bool()) {
        center.x = R.bool() ? Global.Game.width : 0;
        center.y = R.scale(Global.Game.height);
    } else {
        center.y = R.bool() ? Global.Game.height : 0;
        center.x = R.scale(Global.Game.width);
    }

    return self.c.entities.create(Simple, Utils.extend({ center: center }, Settings.Simple));
}

// make n micro enemies
var makeMicro = function (n) {
    var self = this;
    if (self.c.entities.all(Micro).length >= n ||
            self.c.entities.all().length >= Scene.MAX_ENEMIES)
        return;

    var center = { x: 0, y: 0 };

    if (R.bool()) {
        center.x = R.bool() ? Global.Game.width : 0;
        center.y = R.scale(Global.Game.height);
    } else {
        center.y = R.bool() ? Global.Game.height : 0;
        center.x = R.scale(Global.Game.width);
    }

    return self.c.entities.create(Micro, Utils.extend({ center: center }, Settings.Micro));
}

var makeAvoider = function (n) {
    var self = this;
    if (self.c.entities.all(Avoid).length >= n ||
            self.c.entities.all().length >= Scene.MAX_ENEMIES)
        return;

    // var center = R.point(Global.Game.width, Global.Game.height);

    var center = { x: 0, y: 0 };

    if (R.bool()) {
        center.x = R.bool() ? Global.Game.width : 0;
        center.y = R.scale(Global.Game.height);
    } else {
        center.y = R.bool() ? Global.Game.height : 0;
        center.x = R.scale(Global.Game.width);
    }
    // var center = { x: Global.Game.width - 50, y: Global.Game.height / 2 };

    return self.c.entities.create(Avoid, Utils.extend({ center: center }, Settings.Avoid));
}; 

module.exports = PreWave;
