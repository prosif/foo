var Geom = require('mixins/Geometry');
var Stater = require('engine/Stater');
var Timer = require('engine/Timer');

var Joystick = function(game, settings) {
    var me = this;
    this.game = game;

    // Config

    // Interpolate boolean
    // "Should the joystick interpolate between input vectors?"
    this.interpolate = false;

    // Rotation speed
    // 11.25deg / 17msframe
    this.speed = Math.PI / 30 / 17;

        // State

        // Joystick vector
        // "What is the current vector of the joystick?"
        this.theta = 0;

    // Input vector
    // "What was the player's last joystick input?"
    this.input = 0;
    this.dir = { x: 0, y: 0 };

    // Inbetween state
    // "Is the joystick theta in an inbetween state?"
    this.inbetween = false;

    // Joystick pressed state
    // "Was the joystick given input?"
    this.active = false;

    var input = game.c.inputter;

    var defaultInit = function() {
        me.dir = me.getInputVector();
        me.input = me.getInputTheta(); 
    };

    this.stater = new Stater({
        active: function() {
            return !me.keysDown();
        },
        exit: function() {
            me.stater.push("first direction");
        },
        children: {
            "first direction" : {
                init: function() {
                    defaultInit();
                        this.timer = new Timer();
                },
                active: function() {
                    var newDir = me.getInputVector();
                    var newTheta = me.getInputTheta();

                    var noInput = 
                        newDir.x === 0 &&
                        newDir.y === 0;

                    if (noInput) return false;

                    console.log(this.timer.getTime());

                    // Input direction changed
                    var dirChange = 
                        this.timer.getTime() > 0 &&
                        (me.dir.x != newDir.x || me.dir.y != newDir.y);

                    // Active if no direction change or a big change (> 45deg)
                    return
                        !dirChange ||
                        !Geom.angleWithin(newTheta, me.input, Math.PI/4);

                },
                update: function(delta) {
                    me.dir = me.getInputVector();
                    me.input = me.getInputTheta(); 
                    me.theta = me.input;
                    this.timer.update(delta);
                },
                exit: function() {
                    if (!me.keysDown)
                        me.stater.pop();
                    else 
                        me.stater.push("close secondary direction");
                },
                children: {
                    "close secondary direction" : {
                        init: defaultInit,
                        active: function(time) {
                            var newDir = me.getInputVector();
                            var newTheta = me.getInputTheta();

                            // Input direction changed
                            var dirChange = 
                                me.dir.x != newDir.x ||
                                me.dir.y != newDir.y;

                            // Joystick angle reached
                            var angleReached = 
                                me.theta == newTheta;

                            // Active if no direction change
                            return !dirChange && !angleReached;
                        },
                        update: function(delta) {
                            defaultInit();
                            me.theta += Geom.angleShortestApproach(me.theta, me.input, me.speed * delta);
                            me.dir.x = Math.cos(me.theta);
                            me.dir.y = Math.sin(me.theta);
                        },
                        exit: function() {
                            me.stater.pop();
                        },
                    }
                }
            }
        },
    });
};

Joystick.prototype.keysDown = function() {
    var input = this.game.c.inputter;
    return input.isDown(input.LEFT_ARROW)  || input.isDown(input.H) ||
        input.isDown(input.RIGHT_ARROW) || input.isDown(input.L) ||
        input.isDown(input.UP_ARROW)    || input.isDown(input.K) ||
        input.isDown(input.DOWN_ARROW)  || input.isDown(input.J);
};

Joystick.prototype.getInputTheta = function() {
    var input = this.game.c.inputter;

    // Calculate new input direction
    var left, right, down, up;
    left = input.isDown(input.LEFT_ARROW) || input.isDown(input.H);
    right = input.isDown(input.RIGHT_ARROW) || input.isDown(input.L);
    up = input.isDown(input.UP_ARROW) || input.isDown(input.K);
    down = input.isDown(input.DOWN_ARROW) || input.isDown(input.J);

    var xdir = (right ? 1 : left ? -1 : 0);
    var ydir = (down ? -1 : up ? 1 : 0);

    return Geom.angleNormalize(Math.atan2(ydir, xdir)); 
};
Joystick.prototype.getInputVector = function() {
    var input = this.game.c.inputter;

    // Calculate new input direction
    var left, right, down, up;
    left = input.isDown(input.LEFT_ARROW) || input.isDown(input.H);
    right = input.isDown(input.RIGHT_ARROW) || input.isDown(input.L);
    up = input.isDown(input.UP_ARROW) || input.isDown(input.K);
    down = input.isDown(input.DOWN_ARROW) || input.isDown(input.J);

    return { 
        x: (right ? 1 : left ? -1 : 0),
        y: (down ? -1 : up ? 1 : 0)
    };
};
Joystick.prototype.update = function(delta) {
    console.log(this.stater.cur.name);
    this.stater.update(delta);
};

Joystick.prototype.getX = function() {
    return this.dir.x;
}; 
Joystick.prototype.getY = function() {
    return this.dir.y;
}; 
Joystick.prototype.getTheta = function() {
    // console.log("this.theta % (Math.PI*2)", this.theta % (Math.PI*2));
    // console.log("this.theta;", this.theta);
    return this.theta;
}; 
Joystick.prototype.isHot = function() {
    return this.active;
}; 

module.exports = Joystick;
