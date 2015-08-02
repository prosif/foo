define(function(require) {

    var deepFreeze = require("mixins/Utils").deepFreeze;

    var Config = {
        Scene: {
            MAX_ENEMIES: 250,
            MAX_MICROS: 0,
            MAX_AVOIDERS: 5,
            color:"#efefef"
        },

        // Completely namespace player and player's bullet
        Player: {
            Player: {},
            Bullet: {
                delay: 10,
                disorder: 0.3,
            }
        },
        
        Avoid: {
            // speed : 10 / 17,
            speed : 100 / 17,

            // How far enemyies move away from each other
            away: 0,

            // Enemies stay within distance from target
            // within: 250,
            within: 10,

            // Enemy divergence from following player
            jitter: 0
        },
    };

    return deepFreeze(Config);
});
