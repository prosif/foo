define(function(require) {

    var assert = require("mixins/Utils").assert;

    var Scener = function(game, scenes) {
        var scenes;
        var paused = false;
        var store = {};
        var cur;

        scenes.forEach(function(scene) {

            var s = new scene.ctor(game);

            assert("Scene requires a name property", scene.name);
            store[scene.name] = s;

            // Provide defaults for necessary functions
            ["init", "active", "update", "exit"].forEach(function(func) {
                if (func in s)
                    return;

                if (func == "active")
                    s[func] = getTrue;
                else
                    s[func] = doNothing;
            });

        });

        this.start = function(name) {
            assert("Scene: " + name + " does not exist", store[name]);
            cur = store[name];
            cur.init();
        };

        this.update = function(delta) {
            if (!paused) {
                if (cur.active()){
                    cur.update(delta);
                } else {
                   cur.exit();
                }
            }
        };

        this.pause = function() {
            paused = true;
        };

        this.unPause = function() {
            paused = false;
        };

        this.isPaused = function() {
            return paused;
        }
    }

    var doNothing = function() {};
    var getTrue = function() { return true; };

    return Scener;

});
