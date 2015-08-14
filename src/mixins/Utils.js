define(function(require){
    var Utils = {};

    // Extend a, but do not override
    Utils.fill = function(a, b, props) {
        // Extend a with props it doesn't have
        return Utils.extend(a, b, 
                (props || Object.getOwnPropertyNames(b))
                .filter(function(p) { return !(p in a); }));
    };

    // Extend/override a
    Utils.extend = function(a, b, props) {
        if (props === undefined)
            props = Object.getOwnPropertyNames(b);

        props.forEach(function(p) {
            Utils.assert("Property " + p + " missing on target", p in b);
            var type = typeof b[p];
            if (type == "function")
                a[p] = b[p].bind(a);
            else if (type == "object") {
                if (a[p] === undefined)
                    a[p] = Utils.extend({}, b[p]);
                else
                    a[p] = Utils.extend(a[p], b[p]);
            } else
                a[p] = b[p];
        });
        return a;
    };

    // TODO: Extend to take a function as an expr
    Utils.assert = function(str, expr) {
        if (!expr)
            throw new Error(str);
        return true;
    };

    // Freeze all props on object recursively
    Utils.deepFreeze = function deepFreeze(obj) {

        // Freeze properties before freezing self
        Object.getOwnPropertyNames(obj).forEach(function(name) {
            var prop = obj[name];

            // Freeze prop if it is an object
            if (typeof prop == 'object' && !Object.isFrozen(prop))
                deepFreeze(prop);
        });

        // Freeze self
        return Object.freeze(obj);
    };

    return Utils;
});
