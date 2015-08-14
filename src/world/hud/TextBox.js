

    var Bullet = require("world/bullet/Bullet");
    var Utils = require("mixins/Utils");
    var Wall = require("world/wall/Wall");
    var Sprite = require("mixins/Sprite");

    var Maths = require("coquette").Collider.Maths;

    var TextBox = function(game, settings) {
        this.c = game.c;

        Utils.assert("Settings contains coordinates (x, y)", 
                "x" in settings && "y" in settings);
        Utils.extend(this, settings)
    }
    
    TextBox.prototype.draw = function(ctx){
        ctx.save();
        ctx.font = this.font || '18pt Verdana';
        ctx.fillStyle = this.color || "#000";
        ctx.textAlign = this.align || "left";
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    };

    TextBox.prototype.update = function(delta) {

    };

    module.exports = TextBox;


