define(function(require){

    var Utils = require("mixins/Utils");

    var Maths = {

        // Returns the intersection of the ray and circle,
        // which is closest to the ray's start (.center prop)
        closestIntersectionOfRayAndCircle: function(ray, circle) {
            Utils.assert("Argument ray must have a valid velocity", 
                    ray.vel &&
                    typeof(ray.vel.x + ray.vel.y) == "number");
            Utils.assert("Arguments ray and circle must have centers", 
                    ray.center && circle.center &&
                    typeof(ray.center.x + ray.center.y + circle.center.x + circle.center.y) == "number");


            // ray center
            var rx, ry;
            rx = ray.center.x;
            ry = ray.center.y;

            // circle is defined by (x - a)^2 + (y - b)^2 = r2
            var a;
            a = circle.center.x;

            var b;
            b = circle.center.y;

            var r;
            r = circle.size.x / 2;

            // two possible x coordinates of intersection
            var x1, x2;

            // corresponding y coordinates of intersection
            var y1, y2;

            var determinant;

            // if ray is non zero, i.e. non-vertical
            if (ray.vel.x) {

                // ray is defined by y = mx + z, where z = -mc + d
                var m;
                m = ray.vel.y / ray.vel.x; // undefined when bullet path up/down

                var z;
                z = -m * rx + ry; // undefined when bullet path up/down

                // system of cirle and ray is: kx^2 + nx + o = 0
                var k;
                k = 1 + m * m;

                var n;
                n = (-2 * a) + (2 * m * (z - b));

                var o;
                o = (a * a) + ((z - b) * (z - b)) - (r * r);

                // two possible values for x
                x1 = (-n + Math.sqrt(n * n - 4 * k * o)) / 2 / k;
                x2 = (-n - Math.sqrt(n * n - 4 * k * o)) / 2 / k;

                determinant = n * n - 4 * k * o;

                Utils.assert("A solution does not exist", determinant >= 0);

                // two possible values for y
                y1 = m * x1 + z;
                y2 = m * x2 + z;

            } else {

                // Ray is vertical so intersection and ray share an x
                x1 = x2 = rx;
                y1 = -Math.sqrt((r * r) - ((x1 - a) * (x1 - a))) + b;
                y2 = Math.sqrt((r * r) - ((x2 - a) * (x2 - a))) + b;
            }

            // console.log("x1", x1, "y1", y1, "x2", x2, "y2", y2);
            // find soln with shortest dist to ray's center
            var d1, d2;
            d1 = Math.sqrt((rx - x1) * (rx - x1) + (ry - y1) * (ry - y1));
            d2 = Math.sqrt((rx - x2) * (rx - x2) + (ry - y2) * (ry - y2));

            var dx1 = ray.vel.x * (x1 - rx);
            var dx2 = ray.vel.x * (x2 - rx);
            var dy1 = ray.vel.y * (y1 - ry);
            var dy2 = ray.vel.y * (y2 - ry);

            // The direction of d1 and d2 away from ray
            var s1 = (dx1 >= 0 && dy1 >= 0 ? 1 : -1)
            var s2 = (dx2 >= 0 && dy2 >= 0 ? 1 : -1)

            // console.log("(rx, ry)", rx, ry);
            // console.log("(x1, y1) s1 d1", x1, y1, s1, d1);
            // console.log("(x2, y2) s2 d2", x2, y2, s2, d2);

            // set soln x and y
            var x, y;

            if (s1 > 0 && s2 > 0) {
                if (d1 < d2) {
                    x = x1;
                    y = y1;
                } else {
                    x = x2;
                    y = y2;
                }
            } else if (s1 > 0) {
                x = x1;
                y = y1;
            } else {
                x = x2;
                y = y2;
            }
            // console.log("d1", d1, "d2", d2, "b", b);
            // console.log("y1", y1, "y2", y2, "x1", x1, "x2", x2);

            return {
                x: x,
                y: y
            }
        },

    }
    return Maths;
});
