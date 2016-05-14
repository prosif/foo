var Wall = require("world/wall/Wall");
var Player = require("world/player/Player");
var Micro = require("world/enemy/Micro/Micro");
var Avoid = require("world/enemy/Avoid/Avoider");
var TextBox = require("world/hud/TextBox");
var Timer = require("engine/Timer");
var Global = require("main/config");
var R = require("mixins/Random");
var Wave1 = require("world/scenes/waves/1/1");
var Utils = require("mixins/Utils");

var Splash = function (game) {
    this.game = game;
    this.c = game.c;
    this.timer = new Timer();
};

Splash.prototype = {
    init: function() {
        // makeFoo.bind(this)();
        var leftAlign = 200;
        var topAlign = 130;
        this.c.entities.create(TextBox, {
            text: "Foo", 
            font: '60pt Verdana',
            x: leftAlign,
            y: topAlign,
        });

        var pad = 5;
        var height = 20;
        var total = topAlign + 5;
        this.c.entities.create(TextBox, {
            text: "by cdosborn & prosif",
            font: '10pt Verdana',
            x: leftAlign + 6,
            y: total += height + pad,
        });
        this.c.entities.create(TextBox, {
            text: "v" + Global.VERSION, 
            font: '10pt Verdana',
            x: leftAlign + 6,
            y: total += height + pad,
        });

        var toggle = true;
        var pressSTextBox;
        var me = this;
        this.timer.every(400, function() {
            if (toggle)
                pressSTextBox = me.c.entities.create(TextBox, {
                    text: "press S to start",
                    font: '10pt Verdana',
                    x: leftAlign + 5,
                    y: total + height + pad + 50,
                });
            else
                me.c.entities.destroy(pressSTextBox);
            toggle = !toggle;
        });
    },
    active:function() {
        var In = this.c.inputter;
        return !In.isDown(In.S);;
    },
    update: function(delta) {
        this.timer.update(delta);
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
