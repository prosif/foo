;(function(exports) {

    // obj - ref to obj defining size for drawing
    // img - ref to img to be split across frames
    // frames - list of img frames composing anim

    var Animation = function(obj) {
        var curFrame = 0,
            timeLeftOver = 0;

        var img    = obj.img,
            frames = obj.frames,
            fps    = obj.fps,
            size   = obj.size,
            center = obj.center,
            repeat = obj.repeat,
            offset = obj.offset;

        return {
            next: function(delta) {
                var frameDuration = 1 / fps * 1000;
                var timePassed = timeLeftOver + delta;
                var framesToAdvance = (timePassed / frameDuration) | 0;
                var extraTime = timePassed % frameDuration;

                if (!repeat && curFrame == frames.length - 1)
                    return;

                if (framesToAdvance > 0) {
                    curFrame = (curFrame + framesToAdvance) % frames.length;
                }

                timeLeftOver = extraTime;
            },
            draw: function(ctx) { 
                var frame = frames[curFrame],
                    width = size.x,
                    height = size.y,                    
                    x = (center.x - width/2 + offset.x),
                    y = (center.y - height/2 + offset.y);        

                ctx.drawImage(img, frame * width, 0, width, height, x, y, width, height);
            },
            reset: function() {
                curFrame = 0;
                timeLeftOver = 0;
            },
            getFrame: function() {
                return curFrame;
            }
        }
    }

    var Animator = function(owner, game, arr) {
        var activeQueue = [],
            passiveQueue = [],
            anims = {}

        var i, img, jsonObj, size, offset, frames, animObj;

        for (i = 0; i < arr.length; i++) {
            jsonObj = arr[i];
            frames = [];
            animObj = {};

            var defaults = {
                offset: {x:0, y:0},
                center: owner.center,
                size: owner.size,
                fps: 10
            }

            // extend animObj from Defaults
            for (var key in defaults) { 
                animObj[key] = defaults[key];
            }
            // extend animObj from JSON
            for (var key in jsonObj) { 
                animObj[key] = jsonObj[key];
            }

            animObj.img = game.resourcer.get(animObj.name);

            if (!(animObj.frames instanceof Array)) {
                var frames = [];
                for (var j = 0; j < jsonObj.frames; j++) {
                    frames.push(j);
                }
                animObj.frames = frames;
            }

            // Construct animation from animObj
            passiveQueue.push(animObj.name)
            anims[animObj.name] = Animation(animObj);
        }   

        return {
            update: function(delta) {
                var name;
                for (var i = 0, len = passiveQueue.length; i < len; i++) {
                    name = passiveQueue[i];
                    anims[name].reset(); 
                }
                for (var i = 0, len = activeQueue.length; i < len; i++) {
                    name = activeQueue[i];
                    anims[name].next(delta);
                    passiveQueue.push(name);
                }
                activeQueue.length = 0;
            },
            register: function(name, anim) {
                passiveQueue.push(name);
                anims[name] = anim;
            },
            push: function(name) {

                var removeIndex;

                activeQueue.push(name);
                removeIndex = passiveQueue.indexOf(name);
                (removeIndex !== -1) ? passiveQueue.splice(removeIndex, 1) : undefined;
            },
            draw: function(ctx) { 
                for (var i = 0, len = activeQueue.length; i < len; i++) {
                    anims[activeQueue[i]].draw(ctx);
                }
            },
            reset: function() {
                for (var i = 0, len = activeQueue.length; i < len; i++) {
                    name = activeQueue[i];
                    anims[name].reset(); 
                }
                for (var i = 0, len = passiveQueue.length; i < len; i++) {
                    name = passiveQueue[i];
                    anims[name].reset(); 
                }
            },
            getFrame: function(name) {
                return anims[name].getFrame();
            },
            getAnims: function(name) {
                return activeQueue;
            }
        }
    }

    exports.Animator = Animator;

})(this);
