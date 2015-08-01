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

        // Freeze all props on object recursively
        deepFreeze: function deepFreeze(obj) {

            // Freeze properties before freezing self
            Object.getOwnPropertyNames(obj).forEach(function(name) {
                var prop = obj[name];

                // Freeze prop if it is an object
                if (typeof prop == 'object' && !Object.isFrozen(prop))
                    deepFreeze(prop);
            });

            // Freeze self
            return Object.freeze(obj);
        },

    };
    return Utils;
});
