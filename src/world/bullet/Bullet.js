var Player = require('world/player/Player');
var Sprite = require('mixins/Sprite');
var Utils = require('mixins/Utils');

    var Bullet = function(game, settings) {

        this.c = game.c;

        // Note: Player is a circular dependency
        Player = require('world/player/Player');
        Avoid = require('world/enemy/Avoid/Avoider');

        Utils.extend(this, Sprite, ["drawFilledCircle"]);
        Utils.extend(this, {
            size: {x: 5, y: 5},
            color : "#000",
            boundingBox : game.c.collider.CIRCLE,
        });
        Utils.extend(this, settings);

        Utils.assert("Bullet requires a velocity from settings", this.vel);
    };

    Bullet.prototype = {};

    Bullet.prototype.update = function(delta) {
        // console.log(this.center, this.vel);
        this.center.x += this.vel.x * delta;
        this.center.y += this.vel.y * delta;
    };

    Bullet.prototype.collision = function(other) {
        if (!(other instanceof Bullet) &&
            !(other instanceof Avoid)  &&
            !(other instanceof Player)) {
            this.c.entities.destroy(this);
        }
    };

    Bullet.prototype.draw = function(ctx) {
        ctx.fillStyle = this.color || "#f00";
        this.drawFilledCircle(ctx, this.size.x / 2);
    };

    module.exports = Bullet;


