define(function(require){

    var Bullet = require("world/bullet/Bullet");
    var EnemyBullet = require("world/bullet/EnemyBullet");
    var Timer = require("engine/Timer");
    var Wall = require("world/wall/Wall");
    var R = require("mixins/Random");
    //var bConfig = require("world/bullet/Config");
    var Sprite = require("mixins/Sprite");
    var Utils = require("mixins/Utils");

    var Lurker = function(game, settings) {

        var me = this;

        // Avoid circular dependencies (don't place before Enemy)
        var Player = require("world/player/Player");

        var defaults = {
            size: { x:10, y:10 },
            color : "black",
            pointValue: 10,
            speed : 24 / 17 // pixels per 17ms
        }
    
        this.timer = new Timer();
        Utils.extend(this, defaults);
        Utils.extend(this, settings.Lurker);
        Utils.extend(this, Sprite, ["drawRect"]);

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
            this.move(delta);
        };

        this.shoot = function() {
            var n = this.numBullets;
            var theta;
            for (var i = 0; i < n; i++){
                theta = 2 * Math.PI / n * i;
                game.c.entities.create(EnemyBullet, Utils.extend({
                    vel: {
                        x: settings.Bullet.speed * Math.cos(theta),
                        y: settings.Bullet.speed * Math.sin(theta),
                    },
                    center: {
                        x: this.center.x,
                        y: this.center.y
                    },
                }, settings.Bullet));
            }
     
        };

        this.move = function(delta){
            this.center.x += R.any(1, -1) * R.scale(delta/10);
            this.center.y += R.any(1, -1) * R.scale(delta/10);
        }

        this.collision = function(other) {
            if (other instanceof Bullet){
                game.c.entities.destroy(this);
                game.scorer.add(this.pointValue);
                this.mounted = false;
            }
            else if(other instanceof Wall){
                other.alignPlayer(this);
            }
        }

        this.draw = function(ctx) {
            this.drawRect(ctx);
        }

        this.timer.every(1000, function(){
            this.shoot();
        }.bind(this));
    }
    return Lurker;
});
