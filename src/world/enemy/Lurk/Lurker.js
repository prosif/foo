define(function(require){

    var Bullet = require("world/bullet/Bullet");
    var EnemyBullet = require("world/bullet/EnemyBullet");
    var Timer = require("engine/Timer");
    var Wall = require("world/wall/Wall");
    //var bConfig = require("world/bullet/Config");
    var Sprite = require("mixins/Sprite");
    var Utils = require("mixins/Utils");

    var Lurker = function(game, settings) {

        var me = this;

        // Avoid circular dependencies (don't place before Enemy)
        var Player = require("world/player/Player");

        var defaults = {
            center: { x:100, y:100 },
            size: { x:10, y:10 },
            color : "black",
            pointValue: 10,
            speed : 24 / 17 // pixels per 17ms
        }
    
        this.timer = new Timer();
        Utils.extend(this, defaults);
        Utils.extend(this, settings);
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
            //this.followTarget(delta, this.target);
        };

        this.shoot = function() {
            var bulletSettings = {
                color: "#000",
                speed: .1,//1,//.01,
                size:{
                    x: 5,
                    y: 5
                }
            };
            var n = 6;
            for (var i = 0; i < n; i++){
                game.c.entities.create(EnemyBullet, Utils.extend(bulletSettings, {
                    vel: {
                        x: bulletSettings.speed * Math.cos(2*Math.PI / n * i),
                        y: bulletSettings.speed * Math.sin(2*Math.PI / n * i),
                    },
                    center: {
                        x: this.center.x,
                        y: this.center.y
                    },
                }));
            }
     
        };

        this.move = function(delta){
            if(Math.random <= .5){
                this.center.x += Math.random()/10 ;
                this.center.y += Math.random()/10;
            }
            else{
                this.center.x -= Math.random()/10;
                this.center.y -= Math.random()/10;
            }
        }

        this.followTarget = function(delta, target) {
            // The initial enemy/target position diffs
            // (x/y/hypotenuse)
            var xdiff, ydiff, hdiff;
            xdiff = target.center.x - this.center.x;
            ydiff = target.center.y - this.center.y;
            hdiff = Math.sqrt(xdiff * xdiff + ydiff * ydiff);

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

        var drawRect = function(rect, ctx, color) {
            ctx.fillStyle = "black";
            ctx.fillRect(rect.center.x - rect.size.x/2
                       , rect.center.y - rect.size.y/2
                       , rect.size.x
                       , rect.size.y);
        }

        this.timer.every(1000, function(){
            this.shoot();
        }.bind(this));
    }
    return Lurker;
});
