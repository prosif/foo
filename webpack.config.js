var webpack = require("webpack");

module.exports = {
    entry: __dirname + "/src/main/Game",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    // plugins: [
    //      new webpack.ProvidePlugin({ "Coquette": "coquette" }),
    // ],
    // loaders: [
    //     {
    //         test: /coquette/,
    //         loader: "script-loader",
    //     }
    // ],      
    externals: {
        coquette: "Coquette"
    },
    resolve: {
        root: [
            __dirname + "/src",
        ],
        alias: {
            // coquette$: __dirname + "/node_modules/coquette/coquette",
            ifvisible$: __dirname + "/node_modules/ifvisible.js/src/ifvisible"
        },
        extensions: ["", ".js"]
    }
};

