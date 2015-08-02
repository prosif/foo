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
        this.scener = game.scener;
    };

    What.prototype = {
        init: function() {
            this.isActive = true; 
            var thing = this.c.entities.create(Splash, this); 
            this.splashScreen = thing;
            Wall.makeBoundaries(this);
        },
        active:function() {
            // return true if scene is active
            return this.isActive;
        },
        update:function(delta) {
            // update the scene
            var Input = this.c.inputter;
            var S = Input.isDown(Input.S);
            if (S){this.isActive=false;}
        },
        exit: function() {
            this.c.entities.destroy(this.splashScreen);
            this.scener.start("Demo");
        }
    };

   return What;
});

