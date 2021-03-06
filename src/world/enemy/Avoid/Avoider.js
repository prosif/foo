var Bullet = require("world/bullet/Bullet");
var Player = require("world/player/Player");
var Utils = require("mixins/Utils");
var Wall = require("world/wall/Wall");
var Sprite = require("mixins/Sprite");
var Maths = require("coquette").Collider.Maths;
var Geom = require("mixins/Geometry");
var DEBUG = require("main/config").DEBUG;

var Avoider = function(game, settings) {
    this.c = game.c;
    this.game = game;

    // list of bullets that collided with fake external shell
    this.threats = [];

    this.boundingBox = game.c.collider.CIRCLE;

    // Extend this
    Utils.extend(this, Sprite, ["follow", "moveAway", "drawRect", "fillCircle"]);

    var senseRadius = settings.radius * settings.sense;
    Utils.extend(this, {
        size: { x:senseRadius, y:senseRadius },
        radius: senseRadius,
        color: "rgba(127, 127, 127, 0.05)",
        vel: { x: 0, y: 0 },
        center: settings.center
    });

    // Extend core
    this.core = Utils.extend({
        vel: this.vel
    }, settings);
};

Avoider.prototype.draw = function(ctx) {
    if (DEBUG)
        this.drawFilledCircle(ctx);
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
    this.follow.call(this.core, this.target);

    var avel, vx, vy, vr;
    if (false && this.threats.length > 0) {

        avel = this.avoid();
        vx = avel.x;
        vy = avel.y;
        vr = Math.sqrt(vx * vx + vy * vy);

        if (!(isNaN(vx) || isNaN(vy) || isNaN(vr) || vr === 0)) {
            // console.log("vx", vx, "vy", vy, "vr", vr);
            // console.log("vx", vx / vr * this.speed / 17, "vy", vy / vr * this.speed / 17);
            // console.log("nvx", this.vel.x, "nvy", this.vel.y);
            this.vel.x = vx / vr * this.speed / 17;
            this.vel.y = vy / vr * this.speed / 17;
            // this.game.pauser.pause();
        }
    }

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
    var moves = [];

    this.threats.forEach(function(threat) {
        // Intersections of bullet and core ([front, back]);
        var bulletAndCoreFutureIntersections = Geom.intersectionsOfRayAndCircle(threat, self.core); 
        if (bulletAndCoreFutureIntersections.length === 0)
            return;
        var i = bulletAndCoreFutureIntersections[0];
        var j =
            Geom.intersectionRayAndPerpendicularLineThroughPoint(threat,
                    self.core.center); 
            var rayBetweenCoreCenterAndJ = Geom.rayBetween(self.core.center, j);
        var outerCoreIntersection =
            Geom.intersectionsOfRayAndCircle(rayBetweenCoreCenterAndJ,
                    self.core)[0]; 
        var distanceToImpact = Maths.distance(i, threat.center); 
        // console.log("distanceToImpact", distanceToImpact);
        if (DEBUG) {
            threat.color = "#0f0";
            threat.draw(self.c.renderer.getCtx());
            var p = { center: i };
            var r = { center: j };
            var s = { center: outerCoreIntersection };
            // Red is on outer shell
            p.color = "#f00";
            Sprite.drawPoint.call(p, self.c.renderer.getCtx(), 4);
            r.color = "#00f";
            Sprite.drawPoint.call(r, self.c.renderer.getCtx(), 4);
            s.color = "#0ff";
            Sprite.drawPoint.call(s, self.c.renderer.getCtx(), 4);
        }
        // console.log("(j.x - outerCoreIntersection.x) * 1  / distanceToImpact", (j.x - outerCoreIntersection.x) * 1 / distanceToImpact);
        // console.log("(j.y - outerCoreIntersection.y) * 1  / distanceToImpact", (j.y - outerCoreIntersection.y) * 1 / distanceToImpact);
        moves.push({
            x: (j.x - outerCoreIntersection.x) / distanceToImpact,
            y: (j.y - outerCoreIntersection.y) / distanceToImpact,
        });
    });

    var vx = 0, vy = 0;
    moves.forEach(function(m) {
        vx += m.x;
        vy += m.y;
    });

    return {
        x: vx,
        y: vy,
    };
};

Avoider.prototype.collision = function(other) {
    if (other instanceof Bullet) {
        if (Maths.pointInsideCircle(other.center, this.core)) {
            this.game.scorer.add(5);
            this.c.entities.destroy(this);

            // If the core is near the player (target), don't move away from
            // bullets, prevents bug where enemies hover around a shooting player
        } else if (!Maths.circlesIntersecting(this, this.target)) {
            this.moveAway.call(this, other, this.bulletAway);
            // this.threats.push(other);
        }
    }

    else if (other instanceof Player) {
        if (Maths.circlesIntersecting(this.core, other))
            this.c.entities.destroy(other);
    } else if (other instanceof Wall) {
        if (Maths.circleAndRectangleIntersecting(this.core, other))
            other.alignPlayer(this.core);
        // this.c.entities.destroy(this);
    } else if (other instanceof Avoider) {
        this.moveAway.call(this.core, other.core, this.away, true);
    }

};

module.exports = Avoider;
