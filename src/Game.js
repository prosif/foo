define(function(require) {

    var Coquette = require("coquette"),
        config = require("world/config"),
        Player = require("player/Player"),
        pConfig = require("player/config"),
        Enemy = require("enemy/Enemy"),
        eConfig = require("enemy/config");

    var Game = function() {
        var self = this;

        // Main coquette modules
        this.c = new Coquette(this, "canvas", config.Game.Width, config.Game.Height, "pink");
        c.entities.create(Player, pConfig.Player);
        c.entities.create(Enemy, eConfig.Enemy);
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

    };
    return Game;
});
