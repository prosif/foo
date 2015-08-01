define(function(require) {

    var deepFreeze = require("mixins/Utils").deepFreeze;

    var Config = {
        Scene: {
            MAX_ENEMIES: 250,
            MAX_MICROS: 0,
            MAX_AVOIDERS: 1,
            color:"#efefef"
        },

        // Completely namespace player and player's bullet
        Player: {
            Player: {},
            Bullet: {
                delay: 100,
                disorder: 0.1,
            }
        },
        
        Avoid: {
            // speed : 10 / 17,
            speed : 100 / 17,

            // How far micro's move away from each other
            away: 1,

            // Micro's stay within distance from target
            // within: 250,
            within: 10,

            // Micro divergence from following player
            jitter: 0.02
        },
    };

    return deepFreeze(Config);
});
