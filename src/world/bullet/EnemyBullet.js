define(function(require){

    var Wall = require("world/wall/Wall");
    var Bullet = require("world/bullet/Bullet");
    var Player = require("world/player/Player");
    var Sprite = require("mixins/Sprite");
    var Utils = require("mixins/Utils");
    //var Lurker = require("world/enemy/Lurk/Lurker");

    var EnemyBullet = function(game, settings) {

        Utils.assert("Bullet requires a velocity from settings", 
                "vel" in settings);

        Utils.extend(this, settings);
        Utils.extend(this, Sprite, ["drawRect"]);

        this.update = function(delta) {
            this.center.x += this.vel.x * delta;
            this.center.y += this.vel.y * delta;
        };

        this.collision = function(other) {
            if (other instanceof Wall ||
                other instanceof Bullet) {
//                console.log(Lurker);
                //console.log(game.c.entities.all(Lurker).length);
                game.c.entities.destroy(this);
            } else if (other instanceof Player) {
                game.c.entities.destroy(other);
            } 
        }

        this.draw = function(ctx) {
            this.drawRect(ctx);
        }
    }
    return EnemyBullet;
});
