define(function(require){

    var Geom = require("mixins/Geometry");

    var Tests = [
        {
            desc: "Intersection of unit vector (1, 0) and unit circle at (2, 0)",
            answer: { x: 1, y: 0},
            compute: function() { 
                var circle = {
                    center: { x: 2, y: 0 },
                    size: { x: 2, y: 2 },
                };
                var ray = {
                    center: { x: 0, y: 0 },
                    vel: { x: 1, y: 0 },
                };
                return Geom.intersectionsOfRayAndCircle(ray, circle)[0];
            },
            test: function(result, answer) {
                return result.x - answer.x < 0.00001 && 
                       result.y - answer.y < 0.00001;
            }
        }, 
        {
            desc: "Intersection of vertical unit vector and unit circle at (0, 2)",
            answer: { x: 0, y: 1},
            compute: function() { 
                var circle = {
                    center: { x: 0, y: 2 },
                    size: { x: 2, y: 2 },
                };
                var ray = {
                    center: { x: 0, y: 0 },
                    vel: { x: 0, y: 1 },
                };
                return Geom.intersectionsOfRayAndCircle(ray, circle)[0];
            },
            test: function(result, answer) {
                return result.x - answer.x < 0.00001 && 
                       result.y - answer.y < 0.00001;
            }
        },
        {
            desc: "Intersection of vector (1, 1) and unit circle at (1, 1)",
            answer: { x: 1 - 1 / Math.sqrt(2), y: 1 - 1 / Math.sqrt(2) },
            compute: function() { 
                var circle = {
                    center: { x: 1, y: 1 },
                    size: { x: 2, y: 2 },
                };
                var ray = {
                    center: { x: 0, y: 0 },
                    vel: { x: 1, y: 1 },
                };
                return Geom.intersectionsOfRayAndCircle(ray, circle)[0];
            },
            test: function(result, answer) {
                return result.x - answer.x < 0.00001 && 
                       result.y - answer.y < 0.00001;
            }
        },
        {
            desc: "Intersection of vector (-1, 1) and unit circle at (-1, 1)",
            answer: { x: -(1 - 1 / Math.sqrt(2)), y: 1 - 1 / Math.sqrt(2) },
            compute: function() { 
                var circle = {
                    center: { x: -1, y: 1 },
                    size: { x: 2, y: 2 },
                };
                var ray = {
                    center: { x: 0, y: 0 },
                    vel: { x: -1, y: 1 },
                };
                return Geom.intersectionsOfRayAndCircle(ray, circle)[0];
            },
            test: function(result, answer) {
                return result.x - answer.x < 0.00001 && 
                       result.y - answer.y < 0.00001;
            }
        },
        {
            desc: "Horizontal intersection, y = 1 and unit circle at (1, 0)",
            answer: { x: 1, y: 1 },
            compute: function() { 
                var circle = {
                    center: { x: 1, y: 0 },
                    size: { x: 2, y: 2 },
                };
                var ray = {
                    center: { x: 0, y: 1 },
                    vel: { x: 1, y: 0 },
                };
                return Geom.intersectionsOfRayAndCircle(ray, circle)[0];
            },
            test: function(result, answer) {
                return result.x - answer.x < 0.00001 && 
                       result.y - answer.y < 0.00001;
            }
        },
        {
            desc: "Horizontal intersection inside circle",
            answer: { x: 1, y: 0 },
            compute: function() { 
                var circle = {
                    center: { x: 0, y: 0 },
                    size: { x: 2, y: 2 },
                };
                var ray = {
                    center: { x: 0, y: 0 },
                    vel: { x: 1, y: 0 },
                };
                return Geom.intersectionsOfRayAndCircle(ray, circle);
            },
            test: function(result, answer) {
                return result.length == 1 && 
                       result[0].x - answer.x < 0.00001 && 
                       result[0].y - answer.y < 0.00001;
            }
        },
        {
            desc: "Horizontal ray, no intersection with circle",
            answer: [],
            compute: function() { 
                var circle = {
                    center: { x: 3, y: 3 },
                    size: { x: 2, y: 2 },
                };
                var ray = {
                    center: { x: 0, y: 0 },
                    vel: { x: -1, y: 0 },
                };
                return Geom.intersectionsOfRayAndCircle(ray, circle);
            },
            test: function(result, answer) {
                return result.length === 0 && answer.length === 0;
            }
        },
        {
            desc: "Vertical ray, no intersection with circle",
            answer: [],
            compute: function() { 
                var circle = {
                    center: { x: 3, y: 3 },
                    size: { x: 2, y: 2 },
                };
                var ray = {
                    center: { x: 0, y: 0 },
                    vel: { x: 0, y: 1 },
                };
                return Geom.intersectionsOfRayAndCircle(ray, circle);
            },
            test: function(result, answer) {
                return result.length === 0 && answer.length === 0;
            }
        },
        {
            desc: "Diagonal ray, offcenter circle",
            answer: { x: 0.588652, y: 0.588652 },
            compute: function() { 
                var circle = {
                    center: { x: 1, y: 1.5 },
                    size: { x: 2, y: 2 },
                };
                var ray = {
                    center: { x: 0, y: 0 },
                    vel: { x: 1, y: 1 },
                };
                return Geom.intersectionsOfRayAndCircle(ray, circle)[0];
            },
            test: function(result, answer) {
                return result.x - answer.x < 0.001 && result.y - answer.y < 0.001;
            }
        },
        {
            desc: "Diagonal ray, point below intersection",
            answer: { x: 0, y: 0 },
            compute: function() { 
                var point = { x: 1, y: -1 };
                var ray = {
                    center: { x: 0, y: 0 },
                    vel: { x: 1, y: 1 },
                };
                return Geom.intersectionRayAndPerpendicularLineThroughPoint(ray, point);
            },
            test: function(result, answer) {
                return result.x === answer.x && result.y === answer.y;
            }
        },
        {
            desc: "horiontal ray, point below intersection",
            answer: { x: 0, y: 1 },
            compute: function() { 
                var point = { x: 0, y: 0 };
                var ray = {
                    center: { x: 1, y: 1 },
                    vel: { x: 1, y: 0 },
                };
                return Geom.intersectionRayAndPerpendicularLineThroughPoint(ray, point);
            },
            test: function(result, answer) {
                return result.x === answer.x && result.y === answer.y;
            }
        }
    ];

    var totalPassed = 0;
    Tests.forEach(function(t, i) {
        if (i == Tests.length - 1) {
            var result = t.compute();
            var passed = t.test(result, t.answer);
            if (!passed)
                console.log("FAILED:", t.desc, "\nresult:", result, "answer:", t.answer);
            else
                console.log("PASSED:", t.desc, "\nresult:", result, "answer:", t.answer);

            if (passed) totalPassed++ 
        }
    });
    console.log("SUMMARY:", 
            "PASSED:" + totalPassed / Tests.length * 100 + "%",
            "FAILED:" + (Tests.length - totalPassed) / Tests.length * 100 + "%");
    
    return Tests;
});
