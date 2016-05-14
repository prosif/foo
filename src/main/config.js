var deepFreeze = require("mixins/Utils").deepFreeze;

package = require('json!package.json');

module.exports = {
    DEBUG: false,
    VERSION: package.version,
    Game: {
        width: 800,
        height: 400,
        color:"#efefef"
    },
}
