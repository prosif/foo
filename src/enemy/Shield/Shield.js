define(["require", 
        "player/Player", 
        "bullet/Bullet",
        "engine/Timer",
        "engine/Utils",
        ],

    function(require, 
             Player,
             Bullet,
             Timer,
             Utils) {

    var Enemy = function(game, settings) {
        var self = this;

        Utils.extend(this, settings);

        this.timer = new Timer();
        this.shielded = false;

        this.toggleShield = function() {
            self.shielded = !self.shielded;
        }

        this.timer.every(this.shieldDelay, this.toggleShield); 

        this.update = function(delta) {
            var temp;

            this.timer.update(delta);

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
                ctx.fillStyle = this.color;

            ctx.fillRect(this.center.x - this.size.x/2
                       , this.center.y - this.size.y/2
                       , this.size.x
                       , this.size.y);

        }
    }
    return Enemy;
});
