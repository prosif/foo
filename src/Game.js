define(function(require) {

    var Coquette = require("coquette");
    var config = require("world/config");

    var Game = function() {
        var self = this;

        // Main coquette modules
        this.c = new Coquette(this, "canvas", config.Game.Width, config.Game.Height);

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
