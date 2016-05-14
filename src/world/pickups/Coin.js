var Bullet = require("bullet/Bullet");
var Enemy = function(game, settings) {

    // Avoid circular dependencies (don't place before Enemy)
    var Player = require("player/Player");

    var defaults = {
        center: { x:100, y:100 },
        size: { x:5, y:5 },
        color : "gold",
        speed : 24 / 17 // pixels per 17ms
    }

    for (var prop in defaults) {
        if (settings[prop] !== undefined) {
            this[prop] = settings[prop];
        } else {
            this[prop] = defaults[prop];
        }
    }

    this.collision = function(other) {
        if (other instanceof Player){
            other.grantCoin();
            game.c.entities.destroy(this);
        }
    }
    this.draw = function(ctx) {
        drawCircle(this, ctx, this.color);
    }

    var drawCircle = function(circ, ctx, color){
        ctx.beginPath();
        ctx.arc(circ.center.x, circ.center.y, circ.size.x, 0, 2*Math.PI);
        ctx.fillStyle = circ.color;
        ctx.fill();
        ctx.stroke();
    }
}
module.exports = Enemy;
