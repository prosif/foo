var deepFreeze = require("mixins/Utils").deepFreeze;

var Config = {

    Scene: {
        MAX_SIMPLE:  30,
        MAX_AVOIDERS:  30,
        MAX_MICROS:  10,
        MAX_ENEMIES:  50,

        color:"#efefef",
        spawnDelay: 100
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

        // size: { x:20, y:20 },
        size: { x:30, y:30 },

        // How far like enemies move away from each other
        away: 12,

        // How far enemy moves away from bullet
        bulletAway: 5,

        color: "#f0af0f",

        // Enemies stay within distance from target
        // within: 250,
        within: 10,

        // Enemy divergence from following player
        jitter: 0
    },

    Micro: {
        // speed : 500 / 17,
        speed : 100 / 17,

        // How far micro's move away from each other
        away: 3,

        // Micro's stay within distance from target
        within: 50,

        // Micro divergence from following player
        jitter: 0.02
    },
    Simple: {
        speed : 40 / 17,

        size: {
            x: 20,
            y: 20,
        },

        // How far enemyies move away from each other
        away: 5,

        color: "#beb",

        // Enemies stay within distance from target
        // within: 250,
        within: 10,

        // Enemy divergence from following player
        jitter: 0
    },
};

module.exports = deepFreeze(Config);
