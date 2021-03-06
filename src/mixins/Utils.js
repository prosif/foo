var Utils = {

    // Extend a, but do not override
    fill: function(a, b, props) {
        // Extend a with props it doesn't have
        return Utils.extend(a, b, 
                (props || Object.getOwnPropertyNames(b))
                .filter(function(p) { return !(p in a) }));
    },

    // Extend/override a, rebinds functions as well
    extend: function(a, b, props) {
        if (props == undefined)
            props = Object.getOwnPropertyNames(b);

        props.forEach(function(p) {
            Utils.assert("Property " + p + " missing on target", p in b);
            if (b[p].contstructor == Function)
                a[p] = b[p].bind(a);
            else
                a[p] = b[p];
        });
        return a;
    },

    // Impose a call limit on a func.
    // Wrap a func with a call limit, calling the wrapper will only call
    // the func up to n times
    atMost: function(n, func) {
        var count = 0;
        return function() {
            if (count++ >= n)
                return;
            func();
        }
    },

    // Return a bag of bs' functions bound to a. Does not affect a.
    bind: function(a, b, props) {
        var result = {};
        if (props == undefined)
            props = Object.getOwnPropertyNames(b);

        props.forEach(function(p) {
            Utils.assert("Property " + p + " missing on target", p in b);
            if (typeof b[p] == "function")
                result[p] = b[p].bind(a);
        });
        return result;
    },

    // TODO: Extend to take a function as an expr
    assert: function(str, expr) {
        if (!expr)
            throw new Error(str);
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

module.exports = Utils;
