define(function(require) {
    var Timer = function() {
        var time = 0;
        return {
            add: function(delta) { time += delta; },
            getTime: function() { return time; },
            reset: function() { time = 0; }
        }
    }

    return Timer;
});
