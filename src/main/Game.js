define(function(require) {

    var Coquette     = require("coquette");
    var Timer        = require("engine/Timer");
    var Pauser       = require("engine/Pauser");
    var R            = require("mixins/Random");
    var Global       = require("main/config");
    var Wall         = require("world/Wall/Wall");
    var Player       = require("world/player/Player");
    var Micro        = require("world/enemy/Micro/Micro");
    // var Lurker       = require("enemy/Lurker");
    // var ShieldConfig = require("enemy/Shield/config");
    // var Shield       = require("enemy/Shield/Shield")

    var Game = function() {
        var self = this;

        // Main coquette modules
        this.c = new Coquette(this, "canvas", Global.Game.width, Global.Game.height, "pink");

        self.c.entities.create(Micro, {
            center : { 
                x: Global.Game.width,
                y: Global.Game.height / 2,
            },
        }); 

        setInterval(function() {
            if (self.c.entities.all(Micro).length > 20)
                return

            var center = { x: 0, y: 0 };

            if (R.bool()) {
                center.x = R.bool() ? Global.Game.width : 0; 
                center.y = R.scale(Global.Game.height);
            } else {
                center.y = R.bool() ? Global.Game.height : 0;
                center.x = R.scale(Global.Game.width);
            }

            self.c.entities.create(Micro, {
                center : center
            }); 

        }, 100);

        this.c.entities.create(Player);

        this.timer = new Timer();
        this.pauser = new Pauser(this, 
                [this.c.entities, this.c.collider, this.c.renderer]);

        this.update = function(delta) { 
            this.timer.update(delta);
        }

        // Create world boundaries
        Wall.makeBoundaries(this);
    };
    return Game;
});
