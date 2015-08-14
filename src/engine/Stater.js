

    var Utils = require("mixins/Utils");
    var assert = Utils.assert;

    var Stater = function(tree) {
        this.root = makeTree(tree);
        this.cur = this.root;
    }

    Stater.prototype.update = function(delta) {
        var old;

        // Jump through state stack until active state found
        while (!this.cur.active()) {

            // Save reference to current state
            old = this.cur;

            // Set new state
            this.cur.exit()
            
            // Favor explicit state changes in exit
            assert("State must be popped or pushed in exit", old !== this.cur);

            // To child: 
            if (this.cur.parent === old) {
                this.cur.init();
            }
        }
        this.cur.update(delta);
    };

    Stater.prototype.pop = function() {
        assert("Root state cannot be popped", this.cur.parent);
        this.cur = this.cur.parent;
    };

    Stater.prototype.push = function(name) {
        var cur = this.cur;
        assert("State: " + name + 
               " is not a child state of State: " + cur.name, 
               cur.children[name])

        this.cur = cur.children[name];
    };

    // Helper setup method
    var doNothing = function(){};

    // Helper setup method
    var makeTree = function(tree) {
        return makeNode(tree, "root");
    }

    // Helper setup method
    var makeNode = function(tree, name) {
        // tree node

        assert("State " + name + " requires active function", 
                "active" in tree);
        assert("State " + name + " requires exit function", 
                "exit" in tree);

        // Extend w/o overriding
        Utils.fill(tree, {
            init: doNothing,
            update: doNothing,
            name: name
        });

        // tree children
        if (tree.children)
            Object.keys(tree.children).forEach(function(name) {
                tree.children[name] = makeNode(tree.children[name], name);
                tree.children[name].parent = tree;
            });

        return tree;
    };


    module.exports = Stater;


