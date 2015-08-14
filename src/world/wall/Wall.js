// A wall is a simple boundary for the bounds of the world
//
// If a player collides with a wall and calls alignPlayer passing itself
// then that player will be be moved. If wall.type == Wall.RIGHT, then the
// character will be moved to the left side of the wall, etc.

var Wall = function(game, settings) {

    if (settings.type === undefined ||
            settings.target === undefined) {
        throw("Error: Wall settings must include target, and type");
    }

    var target = settings.target;

    for (var i in settings) {
        this[i] = settings[i];
    }

    // defaults.shift brings the wall closer to the target by 'shift'
    // pixels, useful in accounting for the player's strokewidth (which
    // increases the player's perceived size). It might be better to
    // remove that illusion.
    var defaults = {
        width : 50,
        shift : 2
    };

    this.boundingBox = game.c.collider.RECTANGLE;
    this.center = { x: 0, y: 0 };
    this.size = { x: 0, y: 0 };
    this.color = "#f00";

    if (this.type == Wall.LEFT) {
        this.center.x =
            target.center.x - target.size.x / 2 - defaults.width / 2 + defaults.shift;
        this.center.y = target.center.y;
        this.size.x = defaults.width;
        this.size.y = target.size.y;
    } else if (this.type == Wall.RIGHT) {
        this.center.x =
            target.center.x + target.size.x / 2 + defaults.width / 2 - defaults.shift;
        this.center.y = target.center.y;
        this.size.x = defaults.width;
        this.size.y = target.size.y;
    } else if (this.type == Wall.TOP) {
        this.center.x = target.center.x;
        this.center.y =
            target.center.y - target.size.y / 2 - defaults.width / 2 + defaults.shift;
        this.size.x = target.size.x;
        this.size.y = defaults.width;
    } else if (this.type == Wall.BOTTOM) {
        this.center.x = target.center.x;
        this.center.y =
            target.center.y + target.size.y / 2 + defaults.width / 2 - defaults.shift;
        this.size.x = target.size.x;
        this.size.y = defaults.width;
    }


    // this.draw = function(ctx) {
    //     if (Global.DEBUG)
    //         drawRect(this, ctx, this.color);
    // }

};

Wall.prototype = {};
Wall.prototype.alignPlayer = function(player) {
    // console.log("alignPlayer");
    if (this.type == Wall.LEFT)
        player.center.x = this.center.x + this.size.x / 2 + player.size.x / 2;
    else if (this.type == Wall.RIGHT)
        player.center.x = this.center.x - this.size.x / 2 - player.size.x / 2;
    else if (this.type == Wall.TOP)
        player.center.y = this.center.y + this.size.y / 2 + player.size.y / 2;
    else if (this.type == Wall.BOTTOM)
        player.center.y = this.center.y - this.size.y / 2 - player.size.y / 2;
};

// Convenience method to make four walls around world(view)
Wall.makeBoundaries = function(game) {
    var c = game.c;
    var target = {
        center : c.renderer.getViewCenter(),
        size : c.renderer.getViewSize()
    };
    c.entities.create(Wall, {
        type: Wall.LEFT,
        target: target
    });
    c.entities.create(Wall, {
        type: Wall.RIGHT,
        target: target
    });
    c.entities.create(Wall, {
        type: Wall.TOP,
        target: target
    });
    c.entities.create(Wall, {
        type: Wall.BOTTOM,
        target: target
    });
};

Wall.LEFT   = 0;
Wall.RIGHT  = 1;
Wall.TOP    = 2;
Wall.BOTTOM = 3;

module.exports = Wall;
