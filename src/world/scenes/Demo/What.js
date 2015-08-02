define(function(require) {

    var Wall         = require("world/Wall/Wall");
    var Player       = require("world/player/Player");
    var Micro        = require("world/enemy/Micro/Micro");
    var Avoid        = require("world/enemy/Avoid/Avoider");
    var Global       = require("main/config");
    var Settings     = require("./config");
    var R            = require("mixins/Random");
    var Splash       = require("world/image/Splash");
    var Utils        = require("mixins/Utils");

    var Scene = Settings.Scene;

    var What = function (game) {
        this.name = "What";
        this.c = game.c;
        this.scener = game.scener;
    };

    What.prototype = {
        init: function() {
            this.isActive = true; 
            makeFoo();
            Wall.makeBoundaries(this);   
        },
        active:function() {
            // return true if scene is active
            return this.isActive;
        },
        update:function(delta) {
            // update the scene
            var Input = this.c.inputter;
            var S = Input.isDown(Input.S);
            if (S){this.isActive=false;}
        },
        exit: function() {
            var length = this.c.entities.all(Micro).length;
            //this.c.entities.destroy(this.c.entities.all(Micro));
            //console.log(length);
            for(var k = 0; k < length; k++){
                var enemy = this.c.entities.all(Micro)[k];
                this.c.entities.destroy(enemy);
            }
            this.scener.start("Demo");
        }
    };
    
    var makeFoo = function(){
        // f
        for(var i = 0; i < 20; i++){
            this.c.entities.create(Micro, {
                center: {x: 0, y: 0},
                speed: 100/17,
                away: 0,
                within: 0,
                jitter: 0.02,
                target: {center:{x: 300 + 3*i, y: 100}}
            });
        }
        for(var i = 0; i < 30; i++){
            this.c.entities.create(Micro, {
                center: {x: 0, y: 0},
                speed: 100/17,
                away: 0,
                within: 0,
                jitter: 0.02,
                target: {center:{x: 300, y: 100 + 4*i}}
            });
        }
        for(var i = 0; i < 20; i++){
            this.c.entities.create(Micro, {
                center: {x: 0, y: 0},
                speed: 100/17,
                away: 0,
                within: 0,
                jitter: 0.02,
                target: {center:{x: 300 + 3*i, y: 160}}
            });
        }

        // o
        for(var i = 0; i < 32; i++){
            var x = 410 + 35 * Math.cos((360/32) * i),
                y = 180 + 35 * Math.sin((360/32) * i);

            this.c.entities.create(Micro, {
                center: {x: 0, y: 0},
                speed: 100/17,
                away: 0,
                within: 0,
                jitter: 0.02,
                target: {center:{x: x , y: y}}
            });
        }
         for(var i = 0; i < 32; i++){
            var x = 500 + 35 * Math.cos((360/32) * i),
                y = 180 + 35 * Math.sin((360/32) * i);

            this.c.entities.create(Micro, {
                center: {x: 0, y: 0},
                speed: 100/17,
                away: 0,
                within: 0,
                jitter: 0.02,
                target: {center:{x: x , y: y}}
            });
        }
    };

    return What;
});

