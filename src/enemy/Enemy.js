define(function(require){

    var Bullet = require("bullet/Bullet");
    var Utils = require("engine/Utils");
    var Wall = require("world/Wall");
    var Enemy = function(game, settings) {

        // Avoid circular dependencies (don't place before Enemy)
        var Player = require("player/Player");

        var defaults = {
            size: { x:5, y:5 },
            vel: { x: 0, y: 0 },
            color : "#fff",
            speed : 200 / 17 // pixels per 17ms
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
         
            this.follow(this.target, {
                within : 30,  
                jitter : 0.03
            });

            this.center.x += this.vel.x * delta;
            this.center.y += this.vel.y * delta;
        };

        this.follow = function(target, settings) {
            // If this is in the "within" distance from the target, it will
            // repel. "jitter" introduces randomness into the motion.
            var within = settings.within || 0;
            var jitter = Math.min(settings.jitter || 0, 1);

            // The initial enemy/target position diffs, where hdiff is the
            // across distance
            var xdiff, ydiff, hdiff;
            xdiff = target.center.x - this.center.x;
            ydiff = target.center.y - this.center.y;

            xdiff += (Utils.randBool() ? -1 : 1) * jitter * xdiff;
            ydiff += (Utils.randBool() ? -1 : 1) * jitter * ydiff;
            hdiff = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));
            
            // If the direct distance is less than the follow within distance,
            // closeness 
            var closeness = within / hdiff;

            var speed = this.speed - (closeness * this.speed);
            // console.log("cl:", closeness, "this.sp", this.speed, "sp", speed);
            // console.log("tn:", turn, "dif", penalty * turn, "sp", speed);
            
            var velx, vely;
            velx = xdiff / hdiff * speed / 17;
            vely = ydiff / hdiff * speed / 17;

            // if (isNaN(velx) || isNaN(vely)) {
            //     console.log(this.center.x, target.center.x, xdiff, ydiff, hdiff, speed, this.vel.x, this.vel.y);
            //     game.c.entities.destroy(this);
            //     return;
            // }
            this.vel.x = velx;
            this.vel.y = vely;
        }    


        this.moveAway = function(target, _dist) {

            var dist = _dist | 3;

            var xdiff, ydiff, hdiff;
            xdiff = target.center.x - this.center.x;
            ydiff = target.center.y - this.center.y;
            hdiff = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));

            // Only occurs when entity is pressed against a wall
            if (hdiff == 0) {
                // hdiff = 0.1 * Math.random();
                game.c.entities.destroy(this);
                return;
            }

            this.center.x -= xdiff / hdiff * dist;
            this.center.y -= ydiff / hdiff * dist;
        }

        this.collision = function(other) {
            if (other instanceof Wall)
                other.alignPlayer(this);

            else if (other instanceof Bullet)
                game.c.entities.destroy(this);

            else if (other instanceof Enemy)
                this.moveAway(other);

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


// this.followTarget = function(delta, target, penalty) {

//     // Current direction of motion (radians)
//     var dir = Math.atan2(this.vel.y, this.vel.x);

//     // The initial enemy/target position diffs 
//     // (x/y/hypotenuse)
//     var xdiff, ydiff, hdiff;
//     xdiff = target.center.x - this.center.x;
//     ydiff = target.center.y - this.center.y;
//     hdiff = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));

//     // New direction of motion (radians)
//     var newDir = Math.atan2(ydiff, xdiff);

//     // Turn heuristic
//     // How much am I turning? 
//     // (1 for 180 degress, 0 for 0 degrees)
//     var turn = Math.abs(newDir - dir) / Math.PI;

//     // Closeness heuristic
//     // How close is the target relative to my size? 
//     // (1 for within 1 length away, .5 for 5 lengths away, .1 for 10 lengths away, etc)
//     var closeness = this.size.x / hdiff * 5;

//     // penalty represents the degree in which closeness/turn affect 
//     // this's speed
//     var speed = this.speed - (penalty * closeness * this.speed);
//     // console.log("cl:", closeness, "this.sp", this.speed, "sp", speed);
//     // console.log("tn:", turn, "dif", penalty * turn, "sp", speed);


//     // h represents pixels/ms
//     var h = speed / 17;
//     this.vel.x = xdiff / hdiff * h;
//     this.vel.y = ydiff / hdiff * h;

//     this.center.x += this.vel.x * delta;
//     this.center.y += this.vel.y * delta;
// }
