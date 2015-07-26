define(function(require){

    var Bullet = require("bullet/Bullet");
    var Utils = require("engine/Utils");
    var Wall = require("world/Wall");
    var Enemy = function(game, settings) {

        // Avoid circular dependencies (don't place before Enemy)
        var Player = require("player/Player");

        var defaults = {
            size: { x:20, y:20 },
            vel: { x: 0, y: 0 },
            color : "#fff",
            speed : 30 / 17 // pixels per 17ms
        }

        Utils.extend(Utils.extend(this, defaults), settings);

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
         
            this.followTarget(delta, this.target, 0.3);
            //console.log(this.center);
        };

        this.followTarget = function(delta, target, penalty) {

            // Current direction of motion (radians)
            var dir = Math.atan2(this.vel.y, this.vel.x);

            // The initial enemy/target position diffs 
            // (x/y/hypotenuse)
            var xdiff, ydiff, hdiff;
            xdiff = target.center.x - this.center.x;
            ydiff = target.center.y - this.center.y;
            hdiff = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));

            // New direction of motion (radians)
            var newDir = Math.atan2(ydiff, xdiff);

            // Turn heuristic
            // How much am I turning? 
            // (1 for 180 degress, 0 for 0 degrees)
            var turn = Math.abs(newDir - dir) / Math.PI;
            
            // Closeness heuristic
            // How close is the target relative to my size? 
            // (1 for within 1 length away, .5 for 5 lengths away, .1 for 10 lengths away, etc)
            var closeness = Math.min(this.size.x * 2 / hdiff, 1);

            // penalty represents the degree in which closeness/turn affect 
            // this's speed
            var speed = this.speed - (penalty * closeness * this.speed);
            // console.log("cl:", closeness, "this.sp", this.speed, "sp", speed);
            // console.log("tn:", turn, "dif", penalty * turn, "sp", speed);

            
            // h represents pixels/ms
            var h = speed / 17;
            this.vel.x = xdiff / hdiff * h;
            this.vel.y = ydiff / hdiff * h;

            this.center.x += this.vel.x * delta;
            this.center.y += this.vel.y * delta;
        }

        this.collision = function(other) {
            if (other instanceof Wall)
                other.alignPlayer(this);

            else if (other instanceof Bullet)
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
    return Enemy;
});
