define(function(require){

    var Bullet = require("world/bullet/Bullet");
    var Utils = require("mixins/Utils");
    var Wall = require("world/wall/Wall");
    var Sprite = require("mixins/Sprite");

    var Maths = require("coquette").Collider.Maths;

    var TextBox = function(game, settings) {
        this.c = game.c;
        this.text = settings.text;
        this.xPos = settings.xPos;
        this.yPos = settings.yPos;
    }
    
    TextBox.prototype.draw = function(ctx){
        ctx.font = '18pt Calibri';
        ctx.fillStyle = "black";
        ctx.fillText(this.text, this.xPos, this.yPos);
    };

    TextBox.prototype.update = function(delta) {

    };

    return TextBox;
});
