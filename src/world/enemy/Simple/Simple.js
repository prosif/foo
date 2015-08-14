var Bullet = require("world/bullet/Bullet");
var Player = require("world/player/Player");
var Utils = require("mixins/Utils");
var Wall = require("world/wall/Wall");
var Sprite = require("mixins/Sprite");

var Maths = require("coquette").Collider.Maths;

var Simple = function(game, settings) {

    var defaults = {
        size: { x:15, y:15 },
        vel: { x: 0, y: 0 },
        angle: 0, 
        color : "#fff",
        speed : 200 / 17, // pixels per 17ms
        rotation: (2 * Math.PI / 17) * 0.5
    }

    this.c = game.c;
    this.game = game;
    Utils.extend(this, Sprite, ["follow", "moveAway", "drawRect"]);
    Utils.extend(this, defaults);
    Utils.extend(this, settings);
    this.draw = this.drawRect;
}

Simple.prototype.update = function(delta) {
    var temp;

    // Try to set enemy to target Player
    if (!this.target) {
        temp = this.c.entities.all(require("world/player/Player"));
        if (temp.length)
            this.target = temp[0]
        else
            return
    }

    this.follow(this.target, {
        jitter : this.jitter,
        within: this.within
    });

    // console.log("ut:", this.center.x, this.center.y, this.vel.x, this.vel.y);
    this.center.x += this.vel.x * delta;
    this.center.y += this.vel.y * delta;
    this.angle += this.rotation * delta;
};

Simple.prototype.collision = function(other) {
    if (other instanceof Bullet){   
        this.c.entities.destroy(this);
        this.game.scorer.add(1);
    }
    // // if intersecting target, don't do change position!
    // else if (this.target && Maths.pointInsideCircle(this, this.target))
    //     return

    else if (other instanceof Player)
        this.c.entities.destroy(other)
    else if (other instanceof Wall)
        other.alignPlayer(this);
    // this.c.entities.destroy(this);

    else if (other instanceof Simple)
        this.moveAway(other, this.away);

}

module.exports = Simple;
