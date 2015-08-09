define(function(require){

    var Wall = require("world/wall/Wall");
    var Sprite = require("mixins/Sprite");
    var Utils = require("mixins/Utils");

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
            if (other instanceof Wall){
                console.log(game.c.entities.all().length);
                game.c.entities.destroy(this);
            }
        }

        this.draw = function(ctx) {
            this.drawRect(ctx);
        }
    }
    return EnemyBullet;
});
