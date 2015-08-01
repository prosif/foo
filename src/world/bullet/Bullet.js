define(["require",
        "world/player/Player",
        "mixins/Sprite",
        "mixins/Utils"],

    function(require, Player, Sprite, Utils) {

    var Bullet = function(game, settings) {

        this.c = game.c;

        // Note: Player is a circular dependency
        Player = require('world/player/Player');

        Utils.extend(this, Sprite, ["drawFilledCircle"]);
        Utils.extend(this, {
            size: {x: 5, y: 5},
            color : "#000",
            boundingBox : game.c.collider.CIRCLE,
        });
        Utils.extend(this, settings);

        if (this.vel == undefined)
            throw("Bullet requires a velocity from settings");
    }

    Bullet.prototype = {};

    Bullet.prototype.update = function(delta) {
        // console.log(this.center, this.vel);
        this.center.x += this.vel.x * delta;
        this.center.y += this.vel.y * delta;
    };

    Bullet.prototype.collision = function(other) {
        if (!(other instanceof Bullet) &&
            !(other instanceof Player)) {
            // console.log("DIE BULLET");
            this.c.entities.destroy(this);
        }
    }

    Bullet.prototype.draw = function(ctx) {
        ctx.fillStyle = this.color || "#f00";
        this.drawFilledCircle(ctx, this.size.x / 2);
    }

    return Bullet;
});
