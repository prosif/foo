define(function(require) {

    var Wall         = require("world/wall/Wall");
    var Player       = require("world/player/Player");
    var Micro        = require("world/enemy/Micro/Micro");
    var Avoid        = require("world/enemy/Avoid/Avoider");
    var Global       = require("main/config");
    var Settings     = require("./config");
    var R            = require("mixins/Random");

    var Scene = Settings.Scene;

    var Start = function (game) {
        this.name = "Start";
        this.c = game.c;
        foo = this;
    };

    Start.prototype = {
        init: function() {
            // define what happens at beginning

            this.c.entities.create(Player);
            makeAvoider();
            makeMicro();
            setInterval(function() {
                makeMicro();
                makeAvoider();
            }, 100);
            Wall.makeBoundaries(this);

        },
        active:function() {
            // return true if scene is active
        },
        update:function(delta) {
            // update the scene
        },
        exit: function() {
            // define cleanup/scene transition
            // ex. this.game.scener.start(this.next);
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

    var makeAvoider = (function (n) {
        if (self.c.entities.all(Avoid).length >= n ||
                self.c.entities._entities.length >= Scene.MAX_ENEMIES)
            return;

                var center = R.point(Global.Game.width, Global.Game.height);

        return self.c.entities.create(Avoid, {
            center : center,
            // speed : 10 / 17,
            speed : 10 / 17,

            // How far micro's move away from each other
            away: 1,

            // Micro's stay within distance from target
            within: 250,
            // within: 100,

            // Micro divergence from following player
            jitter: 0.02
        });
    }.bind(null, Scene.MAX_AVOIDERS));
    return Start;
});

