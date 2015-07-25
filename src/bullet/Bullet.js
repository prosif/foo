define(function(require){

    var Wall = require("world/Wall");
    var Bullet = function(game, settings) {

        if (settings.vel == undefined)
            throw("Bullet requires a velocity from settings");

        for (var prop in settings) {
           this[prop] = settings[prop];
        }

        this.update = function(delta) {
            this.center.x += this.vel.x * delta;
            this.center.y += this.vel.y * delta;
        };

        this.collision = function(other) {
            // if (!(other instanceof Player))
            if (other instanceof Wall)
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
