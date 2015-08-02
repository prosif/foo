define(function(require){

    var Maths = require("mixins/Maths");

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
                return Maths.closestIntersectionOfRayAndCircle(ray, circle);
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
                return Maths.closestIntersectionOfRayAndCircle(ray, circle);
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
                return Maths.closestIntersectionOfRayAndCircle(ray, circle);
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
                return Maths.closestIntersectionOfRayAndCircle(ray, circle);
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
                return Maths.closestIntersectionOfRayAndCircle(ray, circle);
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
                return Maths.closestIntersectionOfRayAndCircle(ray, circle);
            },
            test: function(result, answer) {
                return result.x - answer.x < 0.00001 && 
                       result.y - answer.y < 0.00001;
            }
        }
    ];

    Tests.forEach(function(t, i) {
        // if (i == 2) {
            var result = t.compute();
            var passed = t.test(result, t.answer);
            if (!passed)
                console.log(t.desc, "result:", result, "answer:", t.answer);
            else
                console.log(t.desc, "state: PASSED");
        // }
    });
    
    return Tests;
});
