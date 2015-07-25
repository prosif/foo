define(function(require) {

    var Coquette = require("coquette");
    var Timer    = require("engine/Timer");
    var Pauser   = require("engine/Pauser");
    var config   = require("world/config");
    var Wall     = require("world/Wall");
    var Player   = require("player/Player");
    var pConfig  = require("player/config");
    var Enemy    = require("enemy/Enemy");
    var eConfig  = require("enemy/config");
    var Lurker  = require("enemy/Lurker");

    var Game = function() {
        var self = this;

        // Main coquette modules
        this.c = new Coquette(this, "canvas", config.Game.Width, config.Game.Height, "pink");

        // Hacky bind to pause/resume coquette on (P keypress)
        Pauser(this);

        var rx,ry;
        setInterval(function() {
            rx = Math.random() * config.Game.Width;
            ry = Math.random() * config.Game.Height;
            c.entities.create(Enemy, {
                center : { x: rx, y: ry },
                size : { x: 20, y: 20 }
            });
        }, 3000);
        setInterval(function() {
            rx = Math.random() * config.Game.Width;
            ry = Math.random() * config.Game.Height;
            c.entities.create(Lurker, {
                center : { x: rx, y: ry },
                size : { x: 15, y: 15 }
            });
        }, 7500);
        c.entities.create(Player, pConfig.Player);
        c.entities.create(Enemy, eConfig.Enemy);

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
