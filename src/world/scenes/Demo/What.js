define(function(require) {

    var Wall         = require("world/Wall/Wall");
    var Player       = require("world/player/Player");
    var Micro        = require("world/enemy/Micro/Micro");
    var Avoid        = require("world/enemy/Avoid/Avoider");
    var Global       = require("main/config");
    var Settings     = require("./config");
    var R            = require("mixins/Random");
    var Splash       = require("world/image/Splash");
    var Utils        = require("mixins/Utils");

    var Scene = Settings.Scene;

    var What = function (game) {
        this.name = "What";
        this.c = game.c;
    };

    What.prototype = {
        init: function() {
           
            // define what happens at beginning
            this.c.entities.create(Splash, this);
        //    this.c.entities.create(Player, Settings.Player);
        //    this.c.entities.create(Player, Settings.Player);
        //    makeAvoider();
        //    makeMicro();
        //    setInterval(function() {
        //        makeMicro();
        //        makeAvoider();
        //    }, 100);
            Wall.makeBoundaries(this);

        },
        active:function() {
            // return true if scene is active
            return true;
        },
        update:function(delta) {
            // update the scene
            var Input = this.c.inputter;
            var S = Input.isDown(Input.S);
            if (S){this.exit();}
        },
        exit: function() {
            console.log("yoo");
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

        return self.c.entities.create(Avoid, Utils.extend({ center: center }, Settings.Avoid));
    }.bind(null, Scene.MAX_AVOIDERS));
    return What;
});

