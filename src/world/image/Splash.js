define(function(require) {

    var Bullet = require("world/bullet/Bullet");
    var Config = require("world/player/config");
    var Global = require("main/config");
    var Micro = require("world/enemy/Micro/Micro");
    var R = require("mixins/Random");
    var Sprite = require("mixins/Sprite");
    var Utils = require("mixins/Utils");
    var Wall = require("world/Wall/Wall");
    
    var Splash = function(game, settings) {

        this.c = game.c;
        this.update = function(delta) {
        };
        
        this.draw = function(ctx) {
            ctx.font = "12px Verdana";
            ctx.fillText("foo", 600, 300);
            ctx.fill();
       };

    };
    return Splash;
});
