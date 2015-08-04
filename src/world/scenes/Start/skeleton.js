define(function(require) {

    var Scene = function (game) {
    };

    Scene.prototype = {
        init: function() {
            // define what happens at beginning
        },
        active:function() {
            // return true if scene is active
        },
        update:function(delta) {
            // update the scene
        },
        exit: function() {
            // define cleanup/scene transition
            // ex. this.game.scener.start(this.next);
        }
    };
    return Scene;
});

