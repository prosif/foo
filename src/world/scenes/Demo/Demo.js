

    var Wall         = require("world/wall/Wall");
    var Player       = require("world/player/Player");
    var Micro        = require("world/enemy/Micro/Micro");
    var Simple       = require("world/enemy/Simple/Simple");
    var Bullet       = require("world/bullet/Bullet");
    var Avoid        = require("world/enemy/Avoid/Avoider");
    var TextBox      = require("world/hud/TextBox");
    var Global       = require("main/config");
    var Settings     = require("./config");
    var R            = require("mixins/Random");
    var Utils        = require("mixins/Utils");

    var Scene = Settings.Scene;

    var Demo = function (game) {
        this.c = game.c;
        this.game = game;
    };

    Demo.prototype = {
        init: function() {
            // define what happens at beginning

            this.c.entities.create(Player, Settings.Player);
            this.scoreBox = this.c.entities.create(TextBox, {
                font: '30pt Verdana',
                x: 15, y: 45, 
                text: this.game.scorer.get(),
            });
            makeAvoider();
            makeMicro();
            makeSimple();
            setInterval(function() {
                makeSimple();
                makeMicro();
                makeAvoider();
            }, 100);
            Wall.makeBoundaries(this);
        },
        active: function() {
            var I = this.c.inputter;
            return !I.isDown(I.R);
        },
        update: function() {

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
            game.scener.start("Demo");
        }
    };

    var makeSimple = (function (n) {
        if (self.c.entities.all(Simple).length >= n ||
                self.c.entities._entities.length >= Scene.MAX_ENEMIES)
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
    }.bind(null, Scene.MAX_SIMPLE));

    // make n micro enemies
    var makeMicro = (function (n) {
        if (self.c.entities.all(Micro).length >= n ||
                self.c.entities._entities.length >= Scene.MAX_ENEMIES)
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
    }.bind(null, Scene.MAX_MICROS));

    var makeAvoider = (function (n) {
        if (self.c.entities.all(Avoid).length >= n ||
                self.c.entities._entities.length >= Scene.MAX_ENEMIES)
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
    }.bind(null, Scene.MAX_AVOIDERS));
    module.exports = Demo;



