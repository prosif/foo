define(function(require){

    var Wall = require("world/Wall");
    var Bullet = function(game, settings) {

        if (settings.theta == undefined)
            throw("Bullet requires a direction from settings object");

        for (var prop in settings) {
           this[prop] = settings[prop];
        }

        this.update = function(delta) {
            var x, y, h;
            h = this.speed * delta / 17;
            x = h * Math.cos(this.theta)
            y = h * Math.sin(this.theta);

            this.center.x += x;
            this.center.y += y;
         
        };

        this.collision = function(other) {
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
