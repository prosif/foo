define(function(require){

    var Bullet = require("world/bullet/Bullet");
    var Utils = require("mixins/Utils");
    var Wall = require("world/Wall/Wall");
    var Sprite = require("mixins/Sprite");
    var Maths = require("coquette").Collider.Maths;

    var Avoider = function(game, settings) {
        var defaults = {
            size: { x:100, y:100 },
            vel: { x: 0, y: 0 },
            color : "#fa0",
            speed : 200 / 17 // pixels per 17ms
        };

        this.c = game.c;
        this.boundingBox = game.c.collider.CIRCLE;
        Utils.extend(this, Sprite, ["follow", "moveAway", "drawRect", "drawFilledCircle"]);
        Utils.extend(this, defaults);
        Utils.extend(this, settings);
    };

    Avoider.prototype.draw = function(ctx) {
        this.drawFilledCircle.call({
            center: this.center,
            size: {
                x: 40
            },
            color: "#f0af0f"
        }, ctx);
    };
    Avoider.prototype.update = function(delta) {
        var temp;

        // Try to set enemy to target Player
        if (!this.target) {
            temp = this.c.entities.all(require("world/player/Player"));
            if (temp.length)
                this.target = temp[0];
            else
                return;
        }

        this.follow.call({
            center: this.center,
            size: {
                x: 40,
                y: 40
            },
            speed: this.speed,
            vel: this.vel,
            within: this.within,
            away: 0,
            jitter: 0,
        }, this.target);

        // console.log("ut:", this.center.x, this.center.y, this.vel.x, this.vel.y);
        this.center.x += this.vel.x * delta;
        this.center.y += this.vel.y * delta;
    };

    Avoider.prototype.collision = function(other) {
        if (other instanceof Bullet) {
            if (Maths.pointInsideCircle(other.center, {
                center: this.center,
                size: {
                    x: 40,
                    y: 40
                }
            })) {
                console.log("WOO");
                this.c.entities.destroy(this);
            }
                this.moveAway(other, 10);
                // set vel perpendic to bullet traject
        }

        // // if intersecting target, don't do change position!
        // else if (this.target && Math.pointInsideCircle(this, this.target))
        //     return

        else if (other instanceof Wall)
            other.alignPlayer(this);
            // this.c.entities.destroy(this);

        // else if (other instanceof Avoider)
        //     this.moveAway(other, this.away);


    };

    return Avoider;
});
