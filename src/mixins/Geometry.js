define(function(require){

    var Utils = require("mixins/Utils");

    var Geometry = {
        angleShortestApproach: function(a, b, delta) {

            var diff = Math.abs(b - a);
            var maxDelta = 
                diff > Math.PI
                ? 2 * Math.PI - diff
                : diff

            // Magnitude to change by
            var shift = Math.min(maxDelta, delta);

            // Factors which affect direction
            var aGreaterB = a - b > 0;
            var shorterPath = diff > Math.PI;

            return Geometry.angleNormalize(a + 
                    (aGreaterB ? -1 : 1) * 
                    (shorterPath ? -1 : 1) * 
                    shift);
        },
        angleNormalize: function(_a) {
            // a is between (-2π 2π)
            var a = _a % (Math.PI * 2)
            if (a < 0) {
                a = 2 * Math.PI + a;
            }
            // a in [0 2π)
            // console.log("a", a * 180 / Math.PI, "_a", _a * 180 / Math.PI);
            return a;
        },
        angleWithin: function(a, b, margin) {
            var diff = Math.abs(a - b);
            return diff > Math.PI
                ? (2 * Math.PI - diff) <= margin
                : diff <= margin
        },
        /* rotate : { x, y } -> radians -> { x, y } */
        rotate: function(vector, theta) {
            var x, y;
            x = vector.x;
            y = vector.y;

            
            var mag; /* Magnitude of vector */
            mag = Math.sqrt(x * x + y * y);

            var curTheta; /* Current angle of vector */
            curTheta = Math.atan2(x, y); 

            return {
                x: mag * Math.cos(theta + curTheta),
                y: mag * Math.sin(theta + curTheta)
            };
        },
        rayBetween: function(a, b) {
            return {
                center: { 
                    x: a.x, 
                    y: a.y 
                },
                vel: { 
                    x: b.x - a.x, 
                    y: b.y - a.y 
                } 
            };
        },
        intersectionRayAndPerpendicularLineThroughPoint: function(ray, point) {

            // line defined by ray
            // ry = rm(rx) + rb
            var rm, rb;

            // line defined perpendicular to ray
            // y = mx + b, where b = -mc + d
            var y, x, m, b;

            if (ray.vel.x === 0) { // vertical ray
                y = point.y
                x = ray.center.x
            } else if (ray.vel.y === 0) { // horizontal ray
                y = ray.center.y; 
                x = point.x;
            } else { 

                rm = ray.vel.y / ray.vel.x; // undefined when bullet path up/down
                rb = -rm * (ray.center.x) + ray.center.y

                    m = - 1 / rm; // undefined when bullet path up/down
                b = -m * point.x + point.y;

                // rx = (ry - rb) / rm 
                // rx = (y - rb) / rm, ry == x
                // rx = (y - rb) / rm, ry == x
                // 
                // y = m(x) + b, subst. rx for x
                // y = m((y - rb) / rm) + b
                // y = m/rm(y) - m/rm(rb) + b
                // y - m/rm(y) =  - m/rm(rb) + b
                // (1 - m/rm)y =  - m/rm(rb) + b
                // y = (- m/rm(rb) + b) / (1 - m/rm)
                y = (b - m * rb / rm) / (1 - m / rm);
                x = (y - rb) / rm;
            };

            return {
                x: x,
                y: y,
            }
        },

        // Returns an array of intersections the first is the closest to the
        // ray's start (.center prop)
        intersectionsOfRayAndCircle: function(ray, circle) {
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

                determinant = n * n - 4 * k * o;

                if (determinant < 0)
                    return [];

                // two possible values for x
                x1 = (-n + Math.sqrt(n * n - 4 * k * o)) / 2 / k;
                x2 = (-n - Math.sqrt(n * n - 4 * k * o)) / 2 / k;


                // two possible values for y
                y1 = m * x1 + z;
                y2 = m * x2 + z;

            } else {

                // Ray is vertical so intersection and ray share an x
                x1 = x2 = rx;
                y1 = -Math.sqrt((r * r) - ((x1 - a) * (x1 - a))) + b;
                y2 = Math.sqrt((r * r) - ((x2 - a) * (x2 - a))) + b;

                determinant = (r * r) - ((x1 - a) * (x1 - a))

                if (determinant < 0)
                    return [];
            }

            // Utils.assert("A solution does not exist", determinant >= 0);

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

            var solutions = [];

            var p1 = {
                x: x1,
                y: y1,
            };

            var p2 = {
                x: x2,
                y: y2,
            };

            // Only push solutions where s[1,2] is positive, meaning solutions in the direction of the ray
            if (s1 > 0 && s2 > 0) {
                if (d1 < d2) {
                    solutions.push(p1);
                    solutions.push(p2);
                } else {
                    solutions.push(p2);
                    solutions.push(p1);
                }
            } else if (s1 > 0) {
                solutions.push(p1);
            } else {
                solutions.push(p2);
            }

            if (determinant == 0)
                solutions.length = 1;
            else if (determinant < 0)
                solutions.length = 0;

            return solutions;
        },

    }
    return Geometry;
});
