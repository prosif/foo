define(function(require){

    var Wall = require("world/Wall");
    var Enemy = require("enemy/Enemy");
    var Bullet = require("bullet/Bullet");
    var bConfig = require("bullet/Config");

    var Player = function(game, settings) {

        for (var prop in settings) {
           this[prop] = settings[prop];
        }
         
        this.lastBullet = 0;
        this.boundingBox = game.c.collider.CIRCLE,

        this.update = function(delta) {

            // The direction of motion
            // (x/y/hypotenuse)
            var xdir, ydir;
            xdir = (c.inputter.isDown(c.inputter.D) ? 1 : (c.inputter.isDown(c.inputter.A) ? -1 : 0));
            ydir = (c.inputter.isDown(c.inputter.S) ? 1 : (c.inputter.isDown(c.inputter.W) ? -1 : 0));

            // The direction of bullet attack
            var bxdir, bydir;
            var left = c.inputter.isDown(c.inputter.LEFT_ARROW) || c.inputter.isDown(c.inputter.H); 
            var right = c.inputter.isDown(c.inputter.RIGHT_ARROW) || c.inputter.isDown(c.inputter.L); 
            var up = c.inputter.isDown(c.inputter.UP_ARROW) || c.inputter.isDown(c.inputter.K); 
            var down = c.inputter.isDown(c.inputter.DOWN_ARROW) || c.inputter.isDown(c.inputter.J); 
            bxdir = (right ? 1 : left ? -1 : 0);
            bydir = (down ? 1 : up ? -1 : 0);

            // console.log(game.timer.getTime(), this.lastBullet, this.bulletDelay);
            if (bxdir || bydir) {
                if ((game.timer.getTime() - this.lastBullet) > this.bulletDelay) {
                    this.lastBullet = game.timer.getTime();
                    bConfig.Bullet.theta = Math.atan2(bydir, bxdir);
                    bConfig.Bullet.center = {
                        x: this.center.x,
                        y: this.center.y,
                    }
                    game.c.entities.create(Bullet, bConfig.Bullet); 
                }
            }

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
