define(["require", 
        "world/Bullet/config", 
        "world/player/Player", 
        "world/Wall/Wall"],

    function(require, Config, Player, Wall) {

    var Bullet = function(game, settings) {

        // Note: Player is a circular dependency
        var Player = require('world/player/Player');
        Utils.extend(Utils.extend(this, Config.Bullet), settings);

        if (this.vel == undefined)
            throw("Bullet requires a velocity from settings");

        this.update = function(delta) {
            this.center.x += this.vel.x * delta;
            this.center.y += this.vel.y * delta;
        };

        this.collision = function(other) {
            if (!(other instanceof Player) &&
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
