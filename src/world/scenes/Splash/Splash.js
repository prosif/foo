var Wall         = require("world/wall/Wall");
var Player       = require("world/player/Player");
var Micro        = require("world/enemy/Micro/Micro");
var Avoid        = require("world/enemy/Avoid/Avoider");
var TextBox      = require("world/hud/TextBox");
var Global       = require("main/config");
var R            = require("mixins/Random");
var Wave1        = require("world/scenes/waves/1/1");
var Utils        = require("mixins/Utils");

var Splash = function (game) {
    this.game = game;
    this.c = game.c;
};

Splash.prototype = {
    init: function() {
        makeFoo.bind(this)();
        this.c.entities.create(TextBox, {
            text: "Press S to start", 
            x: 325, y: 300
        });
        Wall.makeBoundaries(this);   
    },
    active:function() {
        var In = this.c.inputter;
        return !In.isDown(In.S);;
    },
    exit: function() {
        var self = this;
        var destroy = this.c.entities.destroy.bind(this.c.entities);
        var length = this.c.entities.all(Micro).length; 

        // Destroy all created entities
        ([Micro, Wall, TextBox]).forEach(function(type){
            self.c.entities.all(type).forEach(destroy);
        });
        this.game.scener.start(Wave1);
    }
};

var makeFoo = function(){
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

module.exports = Splash;
