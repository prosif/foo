define(function(require) {

    var deepFreeze = require("mixins/Utils").deepFreeze;

    var Config = {
        Scene: {
            MAX_ENEMIES: 250,
            MAX_MICROS: 0,
            MAX_AVOIDERS: 1,
            color:"#ccc"
        },
        Player: {
            Bullet: {
                delay: 100,
                disorder: 0.1,
            }
        }
    };

    return deepFreeze(Config);
});
