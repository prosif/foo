define(["require", 
        "world/Bullet/config", 
        "world/player/Player", 
        "world/Wall/Wall"],

    // Note: Player is a circular dependency, use require('world/player/Player');
    function(require, config, Player, Wall) {

    var Bullet = function(game, settings) {

        config = require("world/Bullet/config");
        Utils.extend(Utils.extend(this, config.Bullet), settings);

        if (this.vel == undefined)
            throw("Bullet requires a velocity from settings");

        this.update = function(delta) {
            this.center.x += this.vel.x * delta;
            this.center.y += this.vel.y * delta;
        };

        this.collision = function(other) {
            if (!(other instanceof require('world/player/Player')) &&
                   !(other instanceof Bullet) )
                game.c.entities.destroy(this);
        }

        this.draw = function(ctx) {
            drawRect(this, ctx, this.color);
        }

        var drawRect = function(rect, ctx, color) {
            //console.log("AYY");
            ctx.fillStyle = color || "#f00";
            ctx.fillRect(rect.center.x - rect.size.x/2
                       , rect.center.y - rect.size.y/2
                       , rect.size.x
                       , rect.size.y);

        }
    }
    return Bullet;
});
