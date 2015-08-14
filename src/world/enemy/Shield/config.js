var deepFreeze = require("mixins/Utils").deepFreeze;

var Config = {
    Enemy: {
        size: {x: 20, y: 20},
        color : "#ff0",
        shieldDelay : 1000,
        speed : 17 / 17 // pixels per 17ms
    }
}

module.exports = deepFreeze(Config);
