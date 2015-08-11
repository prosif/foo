define(function(require) {

    var Wall         = require("world/wall/Wall");
    var Timer        = require("engine/Timer");
    var Player       = require("world/player/Player");
    var Simple       = require("world/enemy/Simple/Simple");
    var Bullet       = require("world/bullet/Bullet");
    var TextBox      = require("world/hud/TextBox");
    var Global       = require("main/config");
    var Settings     = require("./config");
    var R            = require("mixins/Random");
    var W            = require("mixins/Wave");
    var Utils        = require("mixins/Utils");

    var Scene = Settings.Scene;

    var Wave = function (game) {
        this.c = game.c;
        this.game = game;
        this.timer = new Timer();
    };

    Wave.prototype = {
        init: function() {
            // define what happens at beginning

            this.timer = new Timer();
            this.timer.every(Scene.spawnDelay, atMost(Scene.MAX_SIMPLE, makeSimple)); 
            this.c.entities.create(Player, Settings.Player);
            this.scoreBox = this.c.entities.create(TextBox, {
                font: '30pt Verdana',
                x: 15, y: 45, 
                text: this.game.scorer.get(),
            });
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
            ([Player, Bullet, Simple, TextBox, Wall]).forEach(function(type){
                self.c.entities.all(type).forEach(destroy);
            });
            game.scorer.reset();
            if (game.pauser.isPaused())
                game.pauser.unpause();
            game.scener.start("Wave 1");
        }
    };

    var atMost = function(n, cb) {
        var count = 0;
        return function() {
            if (count++ >= n)
                return;
            cb();
        }
    };
    var makeSimple = function (n) {
        var center = { x: 0, y: 0 };

        if (R.bool()) {
            center.x = R.bool() ? Global.Game.width : 0;
            center.y = R.scale(Global.Game.height);
        } else {
            center.y = R.bool() ? Global.Game.height : 0;
            center.x = R.scale(Global.Game.width);
        }

        self.c.entities.create( Simple, 
                Utils.extend({ center: center }, Settings.Simple));

    };

    return Wave;
});

