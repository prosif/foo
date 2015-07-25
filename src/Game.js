define(function(require) {

    var Coquette = require("coquette");
    var config = require("world/config");
    var Wall = require("world/Wall");
    var Player = require("player/Player");
    var pConfig = require("player/config");

    var Game = function() {
        var self = this;

        // Main coquette modules
        this.c = new Coquette(this, "canvas", config.Game.Width, config.Game.Height, "pink");

        //// Project specific modules
        //this.timer     = new Timer();
        //this.resourcer = new Resourcer(config.Game.Resources);
        //this.scener    = new Scener(this, config.Game.Scenes);
        //this.sequencer = new ButtonSequencer(this);

        //this.update = function(delta) { 
        //    this.timer.add(delta);
        //    this.sequencer.update(delta, this.c.inputter.getEvents());
        //    this.scener.update(delta);
        //}

        //this.scener.start("Load");
        this.c.entities.create(Player, pConfig.Player);
        
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
