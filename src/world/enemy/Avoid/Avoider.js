define(function(require){

    var Bullet = require("world/bullet/Bullet");
    var Utils = require("mixins/Utils");
    var Wall = require("world/Wall/Wall");
    var Sprite = require("mixins/Sprite");
    var Maths = require("coquette").Collider.Maths;
    var Geom = require("mixins/Geometry");
    var DEBUG = require("main/config").DEBUG;

    var Avoider = function(game, settings) {
        var defaults = {
            size: { x:100, y:100 },
            vel: { x: 0, y: 0 },
            color : "#fa0",
            speed : 200 / 17 // pixels per 17ms
        };

        this.c = game.c;
        this.game = game;

        // list of bullets that collided with fake external shell
        this.threats = [];

        this.boundingBox = game.c.collider.CIRCLE;
        Utils.extend(this, Sprite, ["follow", "moveAway", "drawRect", "drawFilledCircle"]);
        Utils.extend(this, defaults);
        Utils.extend(this, settings);

        this.core = {
            center: this.center,
            size: { x:40, y:40 },
            color: "#f0af0f",
            speed: this.speed,
            vel: this.vel,
            within: this.within,
            away: this.away,
            jitter: 0,
        }

    };

    Avoider.prototype.draw = function(ctx) {
        this.drawFilledCircle.call(this.core, ctx);
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

        // VV buggy
        // this.follow.call(this.core, this.target);

        this.avoid();

        // console.log("ut:", this.center.x, this.center.y, this.vel.x, this.vel.y);
        this.center.x += this.vel.x * delta;
        this.center.y += this.vel.y * delta;

        //  Clear threats array, repopulated in this.collision
        this.threats.length = 0;
    };

    Avoider.prototype.avoid = function() {
        // Net velocity of threats
        var vel = { x: 0, y: 0 };
        var self = this;

        this.threats.forEach(function(threat) {
            // Intersections of bullet and core ([front, back]);
            var bulletAndCoreFutureIntersections = Geom.intersectionsOfRayAndCircle(threat, self.core); 
            if (bulletAndCoreFutureIntersections.length === 0)
                return;
            var i = bulletAndCoreFutureIntersections[0];
            var distanceToImpact = Maths.distance(i, self.core.center); 
            if (DEBUG) {
                threat.color = "#0f0";
                threat.draw(self.c.renderer.getCtx());
                var p = { center: i };
                p.color = "#f00";
                Sprite.drawPoint.call(p, self.c.renderer.getCtx());
                self.game.pauser.pause();
            }
            // Save distance to impact
            // r = perpendicularRayThroughPoint(ray, point)

            // centray.center + ray.vel
            // Intersection of threat and core
        });
    };

    Avoider.prototype.collision = function(other) {
        if (other instanceof Bullet) {
            if (Maths.pointInsideCircle(other.center, this.core)) {
                this.c.entities.destroy(this);
            } else {
                this.threats.push(other);
            }
            // this.moveAway(other, 3);
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
