define(function(require) {
    var Pauser = function(game) {

        var self = this;

        this.paused = false;

        window.addEventListener("keydown", function(e) {
            if (e.keyCode == 80 /* P */) {
                self.toggle();
                return;
            }
        }, false);

        this.toggle = function() {
            if (this.paused)
                game.c.ticker.start()
            else
                game.c.ticker.stop()

            this.paused = !this.paused;
        }

    };
    return Pauser;
});
