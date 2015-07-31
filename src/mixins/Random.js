define(function(require){

    var Random = {};
    Random.bool =  function() {
        return Math.random() > 0.5;
    }
    Random.any = function() {
       return arguments[Math.floor(Math.random() * arguments.length)]
    }
    Random.scale = function(a) {
        return Math.random() * a;
    }
    Random.point = function(xMax, yMax) {

        xMax = xMax || 1;
        yMax = yMax || 1;

        return { 
            x: Random.between(0, xMax),
            y: Random.between(0, yMax)
        }
    }
    Random.between = function(a, b) {
        var _a;

        // Guarantee b > a, for comparison
        if (a > b) {
            _a = a;
            a = b;
            b = _a;
        }

        return Math.random() * (b - a) + a;
    }
    return Random;
});
