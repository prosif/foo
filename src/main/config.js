define(function(require) {

    var Config = {
        DEBUG: true,
        MAX_ENEMIES: 250,
        MAX_MICROS: 0,
        MAX_AVOIDERS: 1,
        Game: {
            width: 800,
            height: 400,
            color:"#efefef"
        },
        Player: {
            Bullet: {
                delay: 100,
                disorder: 0.1,
            }
        }
    }

    return Config;
});
