define(function(require){

    var Bullet = require("bullet/Bullet");
    var EnemyBullet = require("bullet/EnemyBullet");
    var Timer = require("engine/Timer");
    var bConfig = require("bullet/Config");
    var Utils = require("engine/Utils");
    
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
            var bullet1Settings = {
                center: {
                    x: this.center.x,
                    y: this.center.y,
                },
                vel: {
                    x: -1,// + (bConfig.Bullet.speed / 17 * Math.cos(btheta)),
                    y: 0// + (bConfig.Bullet.speed / 17 * Math.sin(btheta)),
                }
            };          

            var bullet2Settings = {
                center: {
                    x: this.center.x,
                    y: this.center.y,
                },
                vel: {
                    x: 1,// + (bConfig.Bullet.speed / 17 * Math.cos(btheta)),
                    y: 0// + (bConfig.Bullet.speed / 17 * Math.sin(btheta)),
                }
            };         
            
            var bullet3Settings = {
                center: {
                    x: this.center.x,
                    y: this.center.y,
                },
                vel: {
                    x: 0,// + (bConfig.Bullet.speed / 17 * Math.cos(btheta)),
                    y: 1// + (bConfig.Bullet.speed / 17 * Math.sin(btheta)),
                }
            };         

            var bullet4Settings = {
                center: {
                    x: this.center.x,
                    y: this.center.y,
                },
                vel: {
                    x: 0,// + (bConfig.Bullet.speed / 17 * Math.cos(btheta)),
                    y: -1// + (bConfig.Bullet.speed / 17 * Math.sin(btheta)),
                }
            };         

            game.c.entities.create(EnemyBullet, Utils.extend(bullet1Settings, bConfig.Bullet)); 
            game.c.entities.create(EnemyBullet, Utils.extend(bullet2Settings, bConfig.Bullet)); 
            game.c.entities.create(EnemyBullet, Utils.extend(bullet3Settings, bConfig.Bullet)); 
            game.c.entities.create(EnemyBullet, Utils.extend(bullet4Settings, bConfig.Bullet)); 
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
            this.shoot();
        }.bind(this));
    }
    return Lurker;
});
