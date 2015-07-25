define(function(require){

    var Utils = require("engine/Utils");
    var Bullet = require("bullet/Bullet");
    var Enemy = function(game, settings) {

        Utils.extend(this, settings);

        // Avoid circular dependencies (don't place before Enemy)
        var Player = require("player/Player");

        this.timer = new Timer();
        this.shielded = false;

        this.toggleShield = function() {
            this.shielded = !this.shielded;
        }

        this.timer.every(this.shieldDelay, this.toggleShield); 

        this.update = function(delta) {
            var temp;

            timer.update(delta);

            // Try to set enemy to target Player
            if (!this.target) {
                temp = game.c.entities.all(Player);
                if (temp.length)  
                    this.target = temp[0]
                else
                    return
            }
         
            this.followTarget(delta, this.target);
        };

        this.followTarget = function(delta, target) {
            // The initial enemy/target position diffs 
            // (x/y/hypotenuse)
            var xdiff, ydiff, hdiff;
            xdiff = target.center.x - this.center.x;
            ydiff = target.center.y - this.center.y;
            hdiff = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));

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
            if (other instanceof Bullet && !this.shielded)
                game.c.entities.destroy(this);
        }
        this.draw = function(ctx) {

            if (this.shielded)
                ctx.fillStyle = "#000";
            else
                ctx.fillStyle = this.color";

            ctx.fillRect(rect.center.x - rect.size.x/2
                       , rect.center.y - rect.size.y/2
                       , rect.size.x
                       , rect.size.y);

        }
    return Enemy;
});
