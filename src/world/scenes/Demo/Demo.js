define(function(require) {

    var Wall         = require("world/wall/Wall");
    var Player       = require("world/player/Player");
    var Micro        = require("world/enemy/Micro/Micro");
    var Bullet       = require("world/bullet/Bullet");
    var EnemyBullet  = require("world/bullet/EnemyBullet");
    var Lurker       = require("world/enemy/Lurk/Lurker");
    var Avoid        = require("world/enemy/Avoid/Avoider");
    var ScoreBox     = require("world/hud/ScoreBox");
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
            this.c.entities.create(ScoreBox);
            makeAvoider();
            makeMicro();
            makeLurker();
            setInterval(function() {
                makeMicro();
                makeAvoider();
                makeLurker();
            }, 100);
            Wall.makeBoundaries(this);
        },
        active: function() {
            var I = this.c.inputter;
            return !I.isDown(I.R);
        },
        update: function() {
            //console.log(this.c.entities.all(EnemyBullet).length);
            //console.log(this.c.entities.all(Lurker).length);
            var playerAlive = this.c.entities.all(Player).length;

            if (!playerAlive && !this.game.pauser.isPaused()) {

                this.textBox = this.c.entities.create(TextBox, {
                    text: "Press R to restart", 
                    xPos: Global.Game.width / 2 - 50,
                    yPos: 0.3 * Global.Game.height
                }).draw(this.c.renderer.getCtx());

                this.game.pauser.pause();
            }            

        },
        exit: function() {
            var self = this;
            var game = this.game;
            var destroy = this.c.entities.destroy.bind(this.c.entities);
            var length = this.c.entities.all(Micro).length; 
            // Destroy all created entities
            ([Player, EnemyBullet, Bullet, Avoid, Lurker, ScoreBox, TextBox, Micro, Wall]).forEach(function(type){
                self.c.entities.all(type).forEach(destroy);
            });
            game.scorer.reset();
            if (game.pauser.isPaused())
                game.pauser.unpause();
            game.scener.start("Demo");
        }
    };

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

        return self.c.entities.create(Micro, {
            center : center,
            // speed : 500 / 17,
            speed : 100 / 17,

            // How far micro's move away from each other
            away: 0,

            // Micro's stay within distance from target
            within: 50,

            // Micro divergence from following player
            jitter: 0.02
        });
    }.bind(null, Scene.MAX_MICROS));

    var makeScoreBox = function(){
    };

    var makeLurker = (function (n) {
        if (self.c.entities.all(Lurker).length >= n ||
                self.c.entities._entities.length >= Scene.MAX_ENEMIES)
            return;

        // var center = R.point(Global.Game.width, Global.Game.height);

        var center = { x: 400, y: 200 };

        if (R.bool()) {
            center.x = R.bool() ? Global.Game.width : 0;
            center.y = R.scale(Global.Game.height);
        } else {
            center.y = R.bool() ? Global.Game.height : 0;
            center.x = R.scale(Global.Game.width);
       }
//        // var center = { x: Global.Game.width - 50, y: Global.Game.height / 2 };

        return self.c.entities.create(Lurker, Utils.extend({ center: center }, Settings.Lurker));
    }.bind(null, Scene.MAX_LURKERS));

    
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
    return Demo;
});

