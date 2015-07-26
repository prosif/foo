define(function(require){
    var Utils = {
        extend: function(a, b, props) {
            if (props == undefined)
                props = Object.getOwnPropertyNames(b);
            props.forEach(function(p) {
                if (b[p] == undefined) {
                    throw "Property " + p + " is undefined";
                }
                a[p] = b[p];
            });
            return a;
        },
        randBool: function() {
            return Math.random() > 0.5 
        }
    };
    return Utils;
});
