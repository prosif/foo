define(function(require){

    var Wall = require("world/Wall");
    var Enemy = require("enemy/Enemy");

    var Player = function(game, settings) {
        var defaults = {
            center: { x:0, y:0 },
            size: { x:10, y:10 },
            boundingBox : game.c.collider.CIRCLE,
            color : "#000",
            speed: 40 / 17 // pixels per 17ms 
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

            // The direction of motion
            // (x/y/hypotenuse)
            var xdir, ydir;
            xdir = (c.inputter.isDown(c.inputter.D) ? 1 : (c.inputter.isDown(c.inputter.A) ? -1 : 0));
            ydir = (c.inputter.isDown(c.inputter.S) ? 1 : (c.inputter.isDown(c.inputter.W) ? -1 : 0));

            // The diffs of initial/final player position
            // (x/y/hypotenuse)
            // theta is the angle of motion relative to the ground 
            var x, y, h, theta;
            h = this.speed * delta / 17;
            theta = Math.atan2(ydir, xdir);
            x = h * Math.cos(theta) * (xdir == 0? 0 : 1);
            y = h * Math.sin(theta);

            // console.log("xdir:", xdir, "ydir:", ydir, "theta:", theta);
            this.center.x += x;
            this.center.y += y;
        };

        this.collision = function(other) {
            if (other instanceof Wall)
                other.alignPlayer(this);

            if (other instanceof Enemy)
                game.c.entities.destroy(this);
            // console.log(other.constructor);
            // console.log(other);
            //this.color = "#f00";
            //var intersection = this.outside(other);
            //var temp = rectangleFromRectangleIntersection(this, other); 
            //temp && drawRect(temp, ctx, "#f00");
        }
        this.draw = function(ctx) {
            drawCircle(this, ctx, this.color);
            // drawRect(this, ctx, this.color);
        }

        var drawRect = function(rect, ctx, color) {
            ctx.fillStyle = color || "#f00";
            ctx.fillRect(rect.center.x - rect.size.x/2
                       , rect.center.y - rect.size.y/2
                       , rect.size.x
                       , rect.size.y);

        }
        var drawCircle = function(entity, ctx, color) {
            ctx.fillStyle = color || "#f00";
            ctx.strokeStyle = color || "#f00";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(entity.center.x
                  , entity.center.y
                  , entity.size.x / 2
                  , 0
                  , 2 * Math.PI);
            ctx.stroke();
        }
    }
    return Player;
});
