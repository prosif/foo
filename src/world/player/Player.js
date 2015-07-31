define(function(require) {

    var Bullet = require("world/bullet/Bullet");
    var Config = require("world/player/config");
    var Global = require("main/config");
    var Micro = require("world/enemy/Micro/Micro");
    var R = require("mixins/Random");
    var Sprite = require("mixins/Sprite");
    var Utils = require("mixins/Utils");
    var Wall = require("world/Wall/Wall");

    var Player = function(game, settings) {

        this.c = game.c;

        // Config
        Utils.extend(Utils.extend(this, Config.Player), settings);
        Utils.extend(this, Sprite, ["drawCircle"]);
         
        // State
        this.lastBullet = 0;
        this.boundingBox = game.c.collider.CIRCLE,
        this.vel = { x: 0, y: 0 };

        this.update = function(delta) {
            this.move(delta);
            this.shoot(delta);
        }

        this.move = function(delta) {

            var Input = game.c.inputter;

            // The direction of motion
            var xdir, ydir;
            xdir = (Input.isDown(Input.D) ? 1 : (Input.isDown(Input.A) ? -1 : 0));
            ydir = (Input.isDown(Input.S) ? 1 : (Input.isDown(Input.W) ? -1 : 0));

            // The diffs of initial/final player position
            // theta is the angle of motion relative to the ground 
            var x, y, h, theta;
            h = this.speed / 17;
            theta = Math.atan2(ydir, xdir);
            this.vel.x = h * Math.cos(theta) * (xdir == 0 ? 0 : 1);
            this.vel.y = h * Math.sin(theta);

            this.center.x += this.vel.x * delta;
            this.center.y += this.vel.y * delta;

            // Force player coordinates within world
            this.restrict();
        }

        this.restrict = function() {

            // min/max values for player location in world
            var minx, maxx, miny, maxy;

            // pad accounts for the stroke width affecting player dimensions
            var pad = 3;

            maxx = Global.Game.width - this.size.x / 2 - pad;
            minx = this.size.x / 2 + pad;
            maxy = Global.Game.height - this.size.x / 2 - pad;
            miny = this.size.x / 2 + pad;
            this.center.x = Math.max(Math.min(this.center.x, maxx), minx); 
            this.center.y = Math.max(Math.min(this.center.y, maxy), miny); 
        }

        this.shoot = function(delta) {

            var Input = game.c.inputter;

            // The direction of bullet attack
            var left, right, down, up;
            left = Input.isDown(Input.LEFT_ARROW) || Input.isDown(Input.H); 
            right = Input.isDown(Input.RIGHT_ARROW) || Input.isDown(Input.L); 
            up = Input.isDown(Input.UP_ARROW) || Input.isDown(Input.K); 
            down = Input.isDown(Input.DOWN_ARROW) || Input.isDown(Input.J); 

            var bxdir, bydir, btheta;
            bxdir = (right ? 1 : left ? -1 : 0);
            bydir = (down ? 1 : up ? -1 : 0);
            btheta = Math.atan2(bydir, bxdir);

            // If gun has direction, shoot
            if (bxdir || bydir) {
                if ((game.timer.getTime() - this.lastBullet) > Config.Bullet.delay) {
                    this.lastBullet = game.timer.getTime();

                    var any =  R.any(-1, 1);
                    var xtheta = btheta + (R.scale(Config.Bullet.disorder) * any );
                    var xcomp = Math.cos(xtheta);
                    var ycomp = Math.sin(btheta + (R.scale(Config.Bullet.disorder) * R.any(-1, 1)));
                    var settings = {
                        size: {
                            x: Config.Bullet.size,
                            y: Config.Bullet.size,

                        },
                        center: {
                            x: this.center.x,
                            y: this.center.y,
                        },
                        vel: {
                            x: Config.Bullet.speed / 17 * xcomp,
                            y: Config.Bullet.speed / 17 * ycomp,
                        }
                    }
                    // if (xcomp == undefined || isNaN(xcomp))
                    //     console.log("AhAH", xtheta, any, Config.Bullet.disorder);
                    game.c.entities.create(Bullet, settings);              
                }
            }

        };

        this.collision = function(other) {
            if (other instanceof Micro) {
                game.c.entities.destroy(this); 
                if (Global.DEBUG) {
                    other.color = "#f00";
                    other.draw(this.c.renderer.getCtx());
                    // this.color = "#0f0";
                    // this.draw(this.c.renderer.getCtx());
                }
                game.pauser.pause();
            }
        }

        this.draw = function(ctx) {
            ctx.strokeStyle = this.color || "#f00";
            ctx.lineWidth = 4;
            this.drawCircle(ctx, this.size.x / 2 - 1);
        }

    }
    return Player;
});
