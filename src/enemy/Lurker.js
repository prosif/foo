define(function(require){

    var Bullet = require("bullet/Bullet");
    var Timer = require("engine/Timer");
    var bConfig = require("bullet/Config");
//    var Timer = require("../Timer.js");
    var Lurker = function(game, settings) {

        // Avoid circular dependencies (don't place before Enemy)
        var Player = require("player/Player");

        var defaults = {
            center: { x:100, y:100 },
            size: { x:10, y:10 },
            color : "#fff",
            speed : 24 / 17 // pixels per 17ms
        }

        this.timer = new Timer();

        for (var prop in defaults) {
           if (settings[prop] !== undefined) {
               this[prop] = settings[prop];
           } else {
               this[prop] = defaults[prop];
           }
        }

        this.update = function(delta) {
            var temp;
            this.timer.update(delta);
            // Try to set enemy to target Player
            if (!this.target) {
                temp = game.c.entities.all(Player);
                if (temp.length)  
                    this.target = temp[0]
                else
                    return
            }
            
            this.followTarget(delta, this.target);
        };

        this.shoot = function(){
            // TODO: move this to config
         
            // The direction of bullet attack
            var bxdir, bydir, btheta;
            bxdir = 1//(right ? 1 : left ? -1 : 0);
            bydir = 0//(down ? 1 : up ? -1 : 0);
            btheta = Math.atan2(bydir, bxdir);

            // console.log(game.timer.getTime(), this.lastBullet, this.bulletDelay);

            // The diffs of initial/final player position
            // theta is the angle of motion relative to the ground 
            var x, y, h, theta;
            h = this.speed / 17;
            theta = Math.atan2(ydir, xdir);
            this.vel.x = h * Math.cos(theta) * (xdir == 0 ? 0 : 1);
            this.vel.y = h * Math.sin(theta);

            this.center.x += this.vel.x * delta;
            this.center.y += this.vel.y * delta;

            // Shoot bullets after position is updated
            if (bxdir || bydir) {

                if ((game.timer.getTime() - this.lastBullet) > this.bulletDelay) {
                    this.lastBullet = game.timer.getTime();
                    var bulletSettings = {
                        center: {
                            x: this.center.x,
                            y: this.center.y,
                        },
                        vel: {
                            x: this.vel.x + (bConfig.Bullet.speed / 17 * Math.cos(btheta)),
                            y: this.vel.y + (bConfig.Bullet.speed / 17 * Math.sin(btheta)),
                        }
                    };              
                    game.c.entities.create(Bullet, 
                            Utils.extend(bulletSettings, bConfig.Bullet)); 
                }
            }

        }

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
                this.mounted = false;
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
            ctx.fillStyle = color || "black";
            ctx.fillRect(rect.center.x - rect.size.x/2
                       , rect.center.y - rect.size.y/2
                       , rect.size.x
                       , rect.size.y);
        }
        
        this.timer.every(5000, function(){
            console.log("THE FUCK");
            this.shoot();
        }.bind(this));
    }
    return Lurker;
});
