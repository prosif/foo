define(["require", 
        "world/Bullet/config", 
        "world/player/Player", 
        "world/Wall/Wall"],

    function(require, Config, Player, Wall) {

    var Bullet = function(game, settings) {

        // Note: Player is a circular dependency
        var Player = require('world/player/Player');
        Utils.extend(Utils.extend(this, Config.Bullet), settings);

        this.boundingBox = game.c.collider.CIRCLE;
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
            ctx.fillStyle = this.color || "#f00";
            // ctx.lineWidth = 4;
            drawCircle(ctx, this.center, this.size.x / 2);
        }

        var drawCircle = function(ctx, center, radius) {
            ctx.beginPath();
            ctx.arc(center.x, 
                    center.y, 
                    radius,
                    0, 
                    2 * Math.PI);
            ctx.fill();
        }
    }
    return Bullet;
});
