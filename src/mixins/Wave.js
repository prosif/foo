define(function(require){

    var R = require("mixins/Random");
    var Utils = require("mixins/Utils");
    var Time = require("engine/Timer");
    var Player = require("world/player/Player");

    var Wave = {};

    Wave.destroyExcept = function(exceptions) {
        Utils.assert("destroyExcept requires scene: " + this.name + 
                " to have a reference to the coquette game object", "c" in this);

        exceptions = 
            exceptions === undefined
            ? []
            : typeof exceptions != "array"
            ? [ exceptions ]
            : exceptions

        var destroy = this.c.entities.destroy.bind(this.c.entities);
        this.c.entities._entities.filter(function(ent){
            // If entity isn't an exception
            return exceptions.indexOf(ent.constructor) == -1;
        }).forEach(destroy);
    };

    Wave.active = function() {
        var I = this.c.inputter;
        if (I.isDown(I.R))
            return false;

        var playerDead = this.c.entities.all(Player).length === 0;
        if (playerDead)
            return false

        return true;
    };

    Wave.init = function() {
        this.timer = new Timer();
        this.c.entities.create(Player, Settings.Player);
    };

    Wave.exit = function() {

        var me = this;
        this.c.entities._entities.forEach(function(ent) {
            if (!(ent instanceof Player)) 
                me.c.entities.destroy(ent);
        });
    };

    return Wave;
}); 
