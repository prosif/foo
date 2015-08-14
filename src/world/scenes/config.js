

    // A list of scene constructors
    var Scenes = {
        scenes: [
                { 
                    name: "Splash", 
                    ctor: require("world/scenes/Splash/Splash") 
                },
                { 
                    name: "Demo", 
                    ctor: require("world/scenes/Demo/Demo")
                },
            ],
        first: "Splash",
    };
    module.exports = Scenes;



