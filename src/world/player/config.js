define(function(require) {

    var deepFreeze = require("mixins/Utils").deepFreeze;

    var Config = {
        Player: {
            size: {x: 20, y: 20},
            color : "#000",
            speed: 80 / 17, // pixels per 17ms
            bulletDelay: 30,
            bulletDeviation: 0.35
        },
        Bullet: {
            delay: 30,
            disorder: 0.35,
            speed : 200 / 17,
        }
    }

    return deepFreeze(Config);
});
