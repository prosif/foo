define(function(require){

    var Wall = require("world/Wall");

    var Player = function(game, settings) {
        var defaults = {
            center: { x:0, y:0 },
            size: { x:10, y:10 },
            zindex: 0,
            walk: 6,
            grav: 0,
            color : "pink",
            vel: { x: 0, y: 0 }
        }

        for (var prop in defaults) {
           if (settings[prop] !== undefined) {
               this[prop] = settings[prop];
           } else {
               this[prop] = defaults[prop];
           }
        }
         
        var c = game.c, 
            ctx = c.renderer.getCtx();

        this.center = settings.center;
        this.size = settings.size;

        this.update = function(delta) {
            this.vel.x = (c.inputter.isDown(c.inputter.D) ? this.walk : (c.inputter.isDown(c.inputter.A) ? -this.walk : 0));
            this.vel.y = (c.inputter.isDown(c.inputter.S) ? this.walk : (c.inputter.isDown(c.inputter.W) ? -this.walk : this.grav
    ));

            this.center.x += this.vel.x * 17 / delta;
            this.center.y += this.vel.y * 17 / delta;
            this.color = "#000";
            //console.log(this.center);
        };

        this.collision = function(other) {
            if (other instanceof Wall)
                other.alignPlayer(this);
            // console.log(other.constructor);
            // console.log(other);
            //this.color = "#f00";
            //var intersection = this.outside(other);
            //var temp = rectangleFromRectangleIntersection(this, other); 
            //temp && drawRect(temp, ctx, "#f00");
        }
        this.draw = function(ctx) {
            drawRect(this, ctx, this.color);
        }

        var drawRect = function(rect, ctx, color) {
            ctx.fillStyle = color || "#f00";
            ctx.fillRect(rect.center.x - rect.size.x/2
                       , rect.center.y - rect.size.y/2
                       , rect.size.x
                       , rect.size.y);

            }
        }
    return Player;
});
