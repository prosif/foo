define(function(require) {

    Utils = require("engine/Utils");
    Enemy = require("world/enemy/Enemy");
    Wall = require("world/Wall/Wall");
    Bullet = require("world/bullet/Bullet");
    Config = require("world/player/config");

    // "world/enemy/Shield/Shield",
    // "world/bullet/EnemyBullet",
    // "world/enemy/Lurk/Lurker",

    var Player = function(game, settings) {

        // Config
        Utils.extend(Utils.extend(this, Config.Player), settings);
         
        // State
        this.lastBullet = 0;
        this.boundingBox = game.c.collider.CIRCLE,
        this.vel = { x: 0, y: 0 };

        this.update = function(delta) {
            this.move(delta);
            this.shoot(delta);
        }

        this.move = function(delta) {

            // The direction of motion
            var xdir, ydir;
            xdir = (c.inputter.isDown(c.inputter.D) ? 1 : (c.inputter.isDown(c.inputter.A) ? -1 : 0));
            ydir = (c.inputter.isDown(c.inputter.S) ? 1 : (c.inputter.isDown(c.inputter.W) ? -1 : 0));

            // The diffs of initial/final player position
            // theta is the angle of motion relative to the ground 
            var x, y, h, theta;
            h = this.speed / 17;
            theta = Math.atan2(ydir, xdir);
            this.vel.x = h * Math.cos(theta) * (xdir == 0 ? 0 : 1);
            this.vel.y = h * Math.sin(theta);

            this.center.x += this.vel.x * delta;
            this.center.y += this.vel.y * delta;
        }

        this.shoot = function(delta) {

            // The direction of bullet attack
            var bxdir, bydir, btheta;
            var left, right, down, up;
            var left = c.inputter.isDown(c.inputter.LEFT_ARROW) || c.inputter.isDown(c.inputter.H); 
            var right = c.inputter.isDown(c.inputter.RIGHT_ARROW) || c.inputter.isDown(c.inputter.L); 
            var up = c.inputter.isDown(c.inputter.UP_ARROW) || c.inputter.isDown(c.inputter.K); 
            var down = c.inputter.isDown(c.inputter.DOWN_ARROW) || c.inputter.isDown(c.inputter.J); 
            bxdir = (right ? 1 : left ? -1 : 0);
            bydir = (down ? 1 : up ? -1 : 0);
            btheta = Math.atan2(bydir, bxdir);

            // If gun has direction, shoot
            if (bxdir || bydir) {
                if ((game.timer.getTime() - this.lastBullet) > this.bulletDelay) {
                    this.lastBullet = game.timer.getTime();
                    game.c.entities.create(Bullet, {
                        size: {
                            x: (Math.random() > 0.5 ? -1: 1) * Math.random() * Config.Bullet.size + Config.Bullet.size,
                            y: Config.Bullet.size,

                        },
                        center: {
                            x: this.center.x,
                            y: this.center.y,
                        },
                        vel: {
                            x: (Config.Bullet.speed / 17 * Math.cos(btheta + (Math.random() * Config.Bullet.disorder * (Math.random() > 0.5 ? -1: 1)))),
                            y: (Config.Bullet.speed / 17 * Math.sin(btheta + (Math.random() * Config.Bullet.disorder * (Math.random() > 0.5 ? -1: 1)))),
                        }
                    });              
                }
            }

        };

        this.collision = function(other) {
            if (other instanceof Wall)
                other.alignPlayer(this);

            if (other instanceof Enemy)
                game.c.entities.destroy(this); 
        }
        this.draw = function(ctx) {
            ctx.strokeStyle = this.color || "#f00";
            ctx.lineWidth = 4;
            drawCircle(ctx, this.center, this.size.x / 2);
        }

        var drawCircle = function(ctx, center, radius) {
            ctx.beginPath();
            ctx.arc(center.x, 
                    center.y, 
                    radius,
                    0, 
                    2 * Math.PI);
            ctx.stroke();
        }
    }
    return Player;
});
