define(function(require){
    var Utils = {
        extend: function(a, b, props) {
            if (props == undefined)
                props = Object.getOwnPropertyNames(b);
            props.forEach(function(p) {
                if (b[p] == undefined)
                    throw "Property " + p + " is undefined";
                else if (b[p].contstructor == Function)
                    a[p] = b[p].bind(a);
                else
                    a[p] = b[p];
            });
            return a;
        },

        // TODO: Extend to take a function as an expr
        assert: function(str, expr) {
            if (!expr)
                throw str; 
            return true;
        }, 
    };
    return Utils;
});
