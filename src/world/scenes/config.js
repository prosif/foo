define(function(require) {

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
                { 
                    name: "Wave 1", 
                    ctor: require("world/scenes/waves/1/1") 
                },
            ],
        first: "Wave 1",
    };
    return Scenes;

});
