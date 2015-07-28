define(function(require){

    var Sprite = {};
    Sprite.drawRect = function(ctx) {
        var color = this.color || "#fff";
        ctx.fillStyle = color;

        var x, y, w, h;
        x = this.center.x - this.size.x/2; 
        y = this.center.y - this.size.y/2; 
        w = this.size.x; 
        h = this.size.y;

        ctx.fillRect(x, y, w, h);
    };

    Sprite.follow = function(target, settings) {

        var settings = settings || {};

        // If this is in the "within" distance from the target, it will
        // repel. "jitter" introduces randomness into the motion.
        var within = settings.within || 0;
        var jitter = Math.min(settings.jitter || 0, 1);

        // The initial enemy/target position diffs, where hdiff is the
        // across distance
        var xdiff, ydiff, hdiff;
        xdiff = target.center.x - this.center.x;
        ydiff = target.center.y - this.center.y;

        xdiff += (Utils.randBool() ? -1 : 1) * jitter * xdiff;
        ydiff += (Utils.randBool() ? -1 : 1) * jitter * ydiff;
        hdiff = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));

        // If the direct distance is less than the follow within distance,
        // closeness 
        var closeness = within / hdiff;

        var speed = this.speed - (closeness * this.speed);
        // console.log("cl:", closeness, "this.sp", this.speed, "sp", speed);
        // console.log("tn:", turn, "dif", penalty * turn, "sp", speed);

        var velx, vely;
        velx = xdiff / hdiff * speed / 17;
        vely = ydiff / hdiff * speed / 17;

        // if (isNaN(velx) || isNaN(vely)) {
        //     console.log(this.center.x, target.center.x, xdiff, ydiff, hdiff, speed, this.vel.x, this.vel.y);
        //     game.c.entities.destroy(this);
        //     return;
        // }
        this.vel.x = velx;
        this.vel.y = vely;
    }

    Sprite.moveAway = function(target, _dist) {

        var dist = _dist || 3;

        var xdiff, ydiff, hdiff;
        xdiff = target.center.x - this.center.x;
        ydiff = target.center.y - this.center.y;
        hdiff = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));

        // Only occurs when entity is pressed against a wall
        if (hdiff == 0) {
            hdiff = 0.1 * Math.random();
            // game.c.entities.destroy(this);
            // return;
        }

        this.center.x -= xdiff / hdiff * dist;
        this.center.y -= ydiff / hdiff * dist;
    }

    return Sprite;
});
