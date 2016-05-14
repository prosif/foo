var Coquette = require("coquette");
var Timer = require("engine/Timer");
var Pauser = require("engine/Pauser");
var Scener = require("engine/Scener");
var Scorer = require("engine/Scorer");
var Global = require("main/config");

var me =
    Global.DEBUG
    ? window
    : {};

me.c = new Coquette(me,
        "canvas",
        Global.Game.width,
        Global.Game.height,
        Global.Game.color);

// Main coquette modules
me.timer = new Timer();
me.pauser = new Pauser(me,
        [me.c.entities, me.c.collider, me.c.renderer]);

me.scorer = new Scorer(me);

me.update = function(delta) {
    me.timer.update(delta);
    me.scener.update(delta);
}

me.scener = new Scener(me);

// me.scener.start(require("world/scenes/Splash/Splash"));
// me.scener.start(require("world/scenes/Demo/Demo"));
// me.scener.start(require("world/scenes/waves/1/1"));
me.scener.start(require("world/scenes/waves/2/2"));
