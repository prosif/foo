/*

   Camera allows for cinematic transforms of the view, like panning, zooming, etc.

   NOTES ON SETTINGS:
        x, y are transforms of the center of the viewport
        permanent=true, is default, if set to false, transforms will be undone after
        scale=0, the view will be scaled 2^0


   var camera = new Camera(game);
       camera.transform({
            type: Camera.RELATIVE, // transforms are relative to current view
            x: 100,
            y: 100,
            scale: 10,
            time: 500,
            permanent: true,
            ctx: ctx
        }, cb);
*/
var Camera = function(game) {
    var renderer = game.c.renderer;

    var old, dist, center, size, timer, callback, position, scale, transformation;

    old = {};                 // copy of the view's center
    dist = {};                // vertical/horiz distance
    center = {};              // new center which is current transform
    size = renderer.getViewSize();
    timer = {};               // track time from update deltas
    callback = function() {}; // optional cb, called after transform
    scale = 0;                // current scale of CM
    transformation = {};      // current settings of transform

    var update = function(delta) {
        timer.update(delta);

        var ratio, curTime, totalTime;
        curTime = timer.getTime();
        totalTime = transformation.time;

        delta = curTime > totalTime ? curTime - totalTime : delta;
        ratio = delta / totalTime > 1 ? 1 : delta / totalTime;

        center.x += ratio * dist.x;
        center.y += ratio * dist.y;

        renderer.setViewCenter(center);
        (function(s) {
          transformation.ctx.scale(s, s);
          size.x /= s;
          size.y /= s;
          //center.x += (size.x - size.x/scale) / 2 * ratio;
          //center.y += (size.y - size.y/scale) / 2 * ratio;

        })(Math.pow(scale, ratio));

        if (!active()) {
            exit.bind(this)();
        }
    };

    var active = function() {
        return timer.getTime() < transformation.time;
    };

    var transform = function(options, cb) {
        old = renderer.getViewCenter();

        center.x = old.x;
        center.y = old.y;

        callback = cb || doNothing;
        timer = new Timer();

        // transformtion defaults
        var defaults = {
            type: Camera.RELATIVE,
            x: 0,
            y: 0,
            time: 0,
            scale: 0,
            permanent: true,
            ctx : renderer.getCtx()
        };

        // override defaults with options obj
        for (var prop in defaults) {
            transformation[prop] = options[prop] !== undefined ? options[prop] : defaults[prop];
        }

        if (transformation.type === Camera.RELATIVE) {
            dist.x = transformation.x;
            dist.y = transformation.y;
        } else { // Camera.ABSOLUTE
            dist.x = transformation.x - old.x;
            dist.y = transformation.y - old.y;
        }
        scale = Math.pow(2, transformation.scale);

        this.update = update;
    };

    var exit = function() {
        // replace update with do nothing function
        this.update = doNothing;
        if (!transformation.permanent) {
            // undo transforms
            size.x *= scale;
            size.y *= scale;
            var reverseScale = Math.pow(2, -transformation.scale);
            transformation.ctx.scale( reverseScale, reverseScale);
            renderer.setViewCenter(old);
        } else {
            center = {};
            old = {};
        }

        callback();
    };

    var doNothing = function(delta) {};

    return {
        transform : transform,
        update : doNothing
    };
};

Camera.RELATIVE = 0;
Camera.ABSOLUTE = 1;

