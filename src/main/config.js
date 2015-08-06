define(function(require) {

    var deepFreeze = require("mixins/Utils").deepFreeze;

    var Config = {
        DEBUG: false,
        Game: {
            width: 800,
            height: 400,
            color:"#efefef"
        },
    }

    return deepFreeze(Config);
});
