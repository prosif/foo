var visible = require("ifvisible");
var Pauser = function(game, modules) {

    var self = this;

    this.paused = false;
    this.backups = [];

    // Toggle pause on P down
    window.addEventListener("keydown", function(e) {
        if (e.keyCode == 80)
            self.toggle();
    }, false);

    // Pause on tab switch, leaving window;
    visible.on("blur", function() {
        self.pause();
    });

    this.toggle = function() {
        if (this.paused)
            this.unpause();
        else
            this.pause();
    };

    this.isPaused = function() {
        return this.paused;
    };

    this.pause = function() {
        var self = this;

        if (this.paused)
            return;

        this.backups = [];
        modules.forEach(function(m) {
            self.backups.push(m.update);
            m.update = function(){};
        });
        this.paused = true;
    };
    this.unpause = function() {
        var self = this;

        if (!this.paused)
            return;

        this.backups.forEach(function(update, i) {
            modules[i].update = update;
        });
        this.paused = false;
    };

};

module.exports = Pauser;
