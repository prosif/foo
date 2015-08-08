var webpack = require("webpack");

module.exports = {
    entry: __dirname + "/src/main/Game",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    externals: {
        coquette: "Coquette"
    },
    resolve: {
        root: [
            __dirname + "/src",
        ],
        alias: {
            ifvisible$: __dirname + "/node_modules/ifvisible.js/src/ifvisible"
        },
        extensions: ["", ".js"]
    }
};

