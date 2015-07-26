define(function(require) {

    var Coquette     = require("coquette");
    var Utils        = require("engine/Utils");
    var Timer        = require("engine/Timer");
    var Pauser       = require("engine/Pauser");
    var config       = require("world/config");
    var Wall         = require("world/Wall");
    var Player       = require("player/Player");
    var pConfig      = require("player/config");
    var Enemy        = require("enemy/Enemy");
    var Lurker       = require("enemy/Lurker");
    var ShieldConfig = require("enemy/Shield/config");
    var Shield       = require("enemy/Shield/Shield")

    var Game = function() {
        var self = this;

        // Main coquette modules
        this.c = new Coquette(this, "canvas", config.Game.Width, config.Game.Height, "pink");


        var ctx = c.renderer.getCtx();
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;


        // Hacky bind to pause/resume coquette on (P keypress)
        Pauser(this);

        setInterval(function() {
            self.c.entities.create(Enemy, {
                center : { 
                    x: config.Game.Width,
                    y: config.Game.Height / 2,
                },
                size : { x: 20, y: 20 }
            }); 
            // self.c.entities.create(Shield, Utils.extend({
            //     center : { 
            //         x: Math.random() * config.Game.Width, 
            //         y: Math.random() * config.Game.Height 
            //     },
            //     size : { x: 20, y: 20 }
            // }, ShieldConfig.Enemy));
        }, 500);

        // setInterval(function() {
        //     c.entities.create(Lurker, {
        //         center : { 
        //             x: Math.random() * config.Game.Width, 
        //             y: Math.random() * config.Game.Height
        //         },
        //         size : { x: 15, y: 15 }
        //     });
        // }, 7500);

        c.entities.create(Player, pConfig.Player);

        // Project specific modules
        this.timer     = new Timer();
        //this.resourcer = new Resourcer(config.Game.Resources);
        //this.scener    = new Scener(this, config.Game.Scenes);
        //this.sequencer = new ButtonSequencer(this);

        this.update = function(delta) { 
            this.timer.update(delta);
        }

        //this.scener.start("Load");

        // Create world boundaries
        var target = { 
            center : this.c.renderer.getViewCenter(),
            size : this.c.renderer.getViewSize()
        }
        this.c.entities.create(Wall, {
            type: Wall.LEFT,
            target: target
        });
        this.c.entities.create(Wall, {
            type: Wall.RIGHT,
            target: target
        });
        this.c.entities.create(Wall, {
            type: Wall.TOP,
            target: target
        });
        this.c.entities.create(Wall, {
            type: Wall.BOTTOM,
            target: target
        });
    };
    return Game;
});
