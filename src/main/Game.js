define(function(require) {

    var Coquette     = require("coquette").Coquette;
    var Timer        = require("engine/Timer");
    var Pauser       = require("engine/Pauser");
    var Scener       = require("engine/Scener");
    var Scorer       = require("engine/Scorer");
    var Global       = require("main/config");
    var Scenes       = require("world/scenes/config");

    (function() {
        var self = this;

        this.c = new Coquette(this,
                "canvas",
                Global.Game.width,
                Global.Game.height,
                Global.Game.color);

        // Main coquette modules
        this.timer = new Timer();
        this.pauser = new Pauser(this,
                [this.c.entities, this.c.collider, this.c.renderer]);

        this.scorer = new Scorer(this);

        this.update = function(delta) {
            this.timer.update(delta);
            this.scener.update(delta);
        }

        this.scener = new Scener(this, Scenes.scenes);
        this.scener.start(Scenes.first);
    })();
});
