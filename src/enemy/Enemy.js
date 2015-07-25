define(function(require){

    var Bullet = require("bullet/Bullet");
    var Enemy = function(game, settings) {

        // Avoid circular dependencies (don't place before Enemy)
        var Player = require("player/Player");

        var defaults = {
            center: { x:100, y:100 },
            size: { x:10, y:10 },
            color : "#fff",
            speed : 24 / 17 // pixels per 17ms
        }

        for (var prop in defaults) {
           if (settings[prop] !== undefined) {
               this[prop] = settings[prop];
           } else {
               this[prop] = defaults[prop];
           }
        }

        this.update = function(delta) {
            var temp;

            // Try to set enemy to target Player
            if (!this.target) {
                temp = game.c.entities.all(Player);
                if (temp.length)  
                    this.target = temp[0]
                else
                    return
            }
         
            this.followTarget(delta, this.target);
            //console.log(this.center);
        };

        this.followTarget = function(delta, target) {
            // The initial enemy/target position diffs 
            // (x/y/hypotenuse)
            var xdiff, ydiff, hdiff;
            xdiff = target.center.x - this.center.x;
            ydiff = target.center.y - this.center.y;
            hdiff = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));

            // The diffs of initial/final enemy position
            // (x/y/hypotenuse)
            var x, y, h;
            h = this.speed * delta / 17;
            x = xdiff / hdiff * h
            y = ydiff / hdiff * h

            this.center.x += x;
            this.center.y += y;
        }

        this.collision = function(other) {
            if (other instanceof Bullet)
                game.c.entities.destroy(this);
            //outside(this, other);
            //this.color = "#f00";
            //var intersection = this.outside(other);
            //var temp = rectangleFromRectangleIntersection(this, other); 
            //temp && drawRect(temp, ctx, "#f00");
            //intersection && drawPoint(intersection, ctx, "#fff");
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
    return Enemy;
});
