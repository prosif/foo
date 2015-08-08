console.log(__dirname)

module.loaders = [
    {
        test: /Coquette/,
        loader: "script-loader",
    }
]
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
            coquette$: __dirname + "/node_modules/coquette/coquette-min",
            ifvisible$: __dirname + "/node_modules/ifvisible.js/src/ifvisible"
        },
        extensions: ["", ".js"]
    }
};

