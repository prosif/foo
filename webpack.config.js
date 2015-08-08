var path = require("path"),
    webpack = require("webpack");

module.exports = {
    entry: __dirname + "/src/main/Game",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    resolve: {
        root: [
            __dirname + "/src",
        ],
        alias: {
            coquette: path.join(__dirname, "node_modules/coquette/coquette"),
            ifvisible$: __dirname + "/node_modules/ifvisible.js/src/ifvisible"
        },
        extensions: ["", ".js"]
    }
};

