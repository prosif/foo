define(function(require) {

    var deepFreeze = require("mixins/Utils").deepFreeze;

    var Config = {
        Scene: {
            MAX_ENEMIES: 250,
            MAX_MICROS: 0,
            MAX_LURKERS: 8,
            MAX_AVOIDERS: 0,
            color:"#efefef"
        },

        // Completely namespace player and player's bullet
        Player: {
            Player: {},
            Bullet: {
                delay: 30,
                speed: 200 / 17,
                disorder: 0.3,
            }
        },
        
        Avoid: {
            // speed : 10 / 17,
            speed : 40 / 17,

            // How far enemyies move away from each other
            away: 5,

            color: "rgba(127, 127, 127, 0.05)",

            // Enemies stay within distance from target
            // within: 250,
            within: 10,

            // Enemy divergence from following player
            jitter: 0
        },

        Lurker: {
            speed: 40/17
        }
    };

    return deepFreeze(Config);
});
