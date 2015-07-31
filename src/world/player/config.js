define(function(require) {

    var Global = require("main/config");
    var Utils = require("mixins/Utils");
    var Config = {
        Player: {     
            size: {x: 20, y: 20},
            color : "#000",
            speed: 80 / 17, // pixels per 17ms 
            center: {x:400, y: 200},
            bulletDelay: 30,
            bulletDeviation: 0.35 
        },
        Bullet: {
            delay: 30,
            disorder: 0.35,
            speed : 200 / 17,
            size: 5,
        }
    }
    Utils.extend(Config.Bullet, Global.Player.Bullet);
    return Config;
});
