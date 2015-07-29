define(function(require){

    var Random = {};
    Random.bool =  function() {
        return Math.random() > 0.5;
    }
    Random.any = function() {
       return arguments[Math.round(Math.random() * arguments.length)]
    }
    Random.scale = function(a) {
        return Math.random() * a;
    }
    return Random;
});
