define(function(require){

    var Bullet = require("world/bullet/Bullet");
    var Utils = require("mixins/Utils");
    var Wall = require("world/Wall/Wall");
    var Sprite = require("mixins/Sprite");
    // var Enemy = require("mixins/Enemy");

    var Micro = function(game, settings) {

        var defaults = {
            size: { x:5, y:5 },
            vel: { x: 0, y: 0 },
            color : "#fff",
            speed : 200 / 17 // pixels per 17ms
        }

        this.c = game.c;
        Utils.extend(this, Sprite, ["follow", "moveAway", "drawRect"]);
        Utils.extend(this, defaults);
        Utils.extend(this, settings);
        this.draw = this.drawRect;
    }

    // // Inherite enemy's prototype
    // Micro.prototype = new Enemy({}, {});

    // // Reset micro's constructor
    // Micro.contstructor = Micro;

    Micro.prototype.update = function(delta) {
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
            within : 30,  
            jitter : 0.03
        });

        // console.log("ut:", this.center.x, this.center.y, this.vel.x, this.vel.y); 
        this.center.x += this.vel.x * delta;
        this.center.y += this.vel.y * delta;
    };

    Micro.prototype.collision = function(other) {
        if (other instanceof Wall)
            other.alignPlayer(this);

        else if (other instanceof Bullet)
            this.c.entities.destroy(this);

        else if (other instanceof Micro)
            this.moveAway(other);

    }

    return Micro;
});


// this.followTarget = function(delta, target, penalty) {

//     // Current direction of motion (radians)
//     var dir = Math.atan2(this.vel.y, this.vel.x);

//     // The initial enemy/target position diffs 
//     // (x/y/hypotenuse)
//     var xdiff, ydiff, hdiff;
//     xdiff = target.center.x - this.center.x;
//     ydiff = target.center.y - this.center.y;
//     hdiff = Math.sqrt(xdiff * xdiff + ydiff * ydiff);

//     // New direction of motion (radians)
//     var newDir = Math.atan2(ydiff, xdiff);

//     // Turn heuristic
//     // How much am I turning? 
//     // (1 for 180 degress, 0 for 0 degrees)
//     var turn = Math.abs(newDir - dir) / Math.PI;

//     // Closeness heuristic
//     // How close is the target relative to my size? 
//     // (1 for within 1 length away, .5 for 5 lengths away, .1 for 10 lengths away, etc)
//     var closeness = this.size.x / hdiff * 5;

//     // penalty represents the degree in which closeness/turn affect 
//     // this's speed
//     var speed = this.speed - (penalty * closeness * this.speed);
//     // console.log("cl:", closeness, "this.sp", this.speed, "sp", speed);
//     // console.log("tn:", turn, "dif", penalty * turn, "sp", speed);


//     // h represents pixels/ms
//     var h = speed / 17;
//     this.vel.x = xdiff / hdiff * h;
//     this.vel.y = ydiff / hdiff * h;

//     this.center.x += this.vel.x * delta;
//     this.center.y += this.vel.y * delta;
// } 
