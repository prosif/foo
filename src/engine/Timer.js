define(function(require) {
    var Timer = function() {
        this.time = 0;
        this.callbacks = [];
    }

    Timer.prototype = {
        update: function(delta) { 
            this.time += delta; 
            if (this.callbacks) {
                this.callbacks.forEach(function(cbObj) {
                    if (this.time - cbObj.lastTime >  
                            cbObj.interval) {
                        cbObj.callback();
                        cbObj.lastTime = this.time;
                    }
                });
            }
        },
        getTime: function() {
            return this.time;
        },
        reset: function() { 
            this.time = 0; 
        },
        every: function(interval, callback) {
            this.callbacks.push({
                interval : interval,
                callback : callback
            });
        }
    };

    return Timer;
});
