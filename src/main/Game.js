define(function(require) {

    var Coquette     = require("coquette");
    var Timer        = require("engine/Timer");
    var Pauser       = require("engine/Pauser");
    var Scener       = require("engine/Scener");
    var Global       = require("main/config");
    var Scenes       = require("world/scenes/config");

    var Game = function() {
        var self = this;

        this.c = new Coquette(this,
                "canvas",
                Global.Game.width,
                Global.Game.height,
                Global.Game.color);

        // Main coquette modules
        this.timer = new Timer();
        this.scener = new Scener(this, Scenes);
        this.pauser = new Pauser(this,
                [this.c.entities, this.c.collider, this.c.renderer]);

        this.update = function(delta) {
            this.timer.update(delta);
            this.scener.update(delta);
        }

        // Create world boundaries
//        this.scener.start("Demo");/
        this.scener.start("What");
//        this.scener.start("Demo");
    };
    return Game;
});
