var deepFreeze = require("mixins/Utils").deepFreeze;

var Config = {

    Scene: {
        MAX_MICRO:  200,
        color:"#fff",
        spawnDelay: 0
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

    Micro: {
        speed : 300 / 17,

        // How far micro's move away from each other
        // away: 3,
        away: 5,

        // Micro's stay within distance from target
        within: 40,

        // Micro divergence from following player
        jitter: 0.02
    },
};

module.exports = deepFreeze(Config);
