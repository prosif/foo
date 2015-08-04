define(function(require){

    var Bullet = require("world/bullet/Bullet");
    var Utils = require("mixins/Utils");
    var Wall = require("world/Wall/Wall");
    var Sprite = require("mixins/Sprite");

    var Maths = require("coquette").Collider.Maths;

    var ScoreBox = function(game, settings) {
        this.c = game.c;
        this.getScore = function(){
            return game.getScore();
        }
    }
    
    ScoreBox.prototype.draw = function(ctx){
        ctx.font = '30pt Calibri';
        ctx.fillStyle = "black";
        ctx.fillText(this.getScore(), 30, 30);
    };

    ScoreBox.prototype.update = function(delta) {

    };

    return ScoreBox;
});
