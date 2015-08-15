/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Coquette = __webpack_require__(1);
	var Timer = __webpack_require__(2);
	var Pauser = __webpack_require__(3);
	var Scener = __webpack_require__(5);
	var Scorer = __webpack_require__(8);
	var Global = __webpack_require__(7);

	var me =
	    Global.DEBUG
	    ? window
	    : {};

	me.c = new Coquette(me,
	        "canvas",
	        Global.Game.width,
	        Global.Game.height,
	        Global.Game.color);

	// Main coquette modules
	me.timer = new Timer();
	me.pauser = new Pauser(me,
	        [me.c.entities, me.c.collider, me.c.renderer]);

	me.scorer = new Scorer(me);

	me.update = function(delta) {
	    me.timer.update(delta);
	    me.scener.update(delta);
	}

	me.scener = new Scener(me);

	me.scener.start(__webpack_require__(9));
	// me.scener.start(require("world/scenes/waves/1/1"));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	;(function(exports) {
	  var Coquette = function(game, canvasId, width, height, backgroundColor, autoFocus) {
	    var canvas = document.getElementById(canvasId);
	    this.renderer = new Coquette.Renderer(this, game, canvas, width, height, backgroundColor);
	    this.inputter = new Coquette.Inputter(this, canvas, autoFocus);
	    this.entities = new Coquette.Entities(this, game);
	    this.runner = new Coquette.Runner(this);
	    this.collider = new Coquette.Collider(this);

	    var self = this;
	    this.ticker = new Coquette.Ticker(this, function(interval) {
	      self.runner.update(interval);
	      if (game.update !== undefined) {
	        game.update(interval);
	      }

	      self.entities.update(interval)
	      self.renderer.update(interval);
	      self.collider.update(interval);
	      self.inputter.update();
	    });
	  };

	  if (true)
	      module.exports = Coquette;
	  else
	      exports.Coquette = Coquette;

	})(this);

	;(function(exports) {
	  var Collider = function(coquette) {
	    this.c = coquette;
	  };

	  var isSetupForCollisions = function(obj) {
	    return obj.center !== undefined && obj.size !== undefined;
	  };

	  Collider.prototype = {
	    _currentCollisionPairs: [],

	    update: function() {
	      this._currentCollisionPairs = [];

	      // get all entity pairs to test for collision
	      var ent = this.c.entities.all();
	      for (var i = 0, len = ent.length; i < len; i++) {
	        for (var j = i + 1; j < len; j++) {
	          this._currentCollisionPairs.push([ent[i], ent[j]]);
	        }
	      }

	      // test collisions
	      while (this._currentCollisionPairs.length > 0) {
	        var pair = this._currentCollisionPairs.shift();
	        if (this.isColliding(pair[0], pair[1])) {
	          this.collision(pair[0], pair[1]);
	        }
	      }
	    },

	    collision: function(entity1, entity2) {
	      notifyEntityOfCollision(entity1, entity2);
	      notifyEntityOfCollision(entity2, entity1);
	    },

	    createEntity: function(entity) {
	      var ent = this.c.entities.all();
	      for (var i = 0, len = ent.length; i < len; i++) {
	        if (ent[i] !== entity) { // decouple from when c.entities adds to _entities
	          this._currentCollisionPairs.push([ent[i], entity]);
	        }
	      }
	    },

	    destroyEntity: function(entity) {
	      // if coll detection happening, remove any pairs that include entity
	      for(var i = this._currentCollisionPairs.length - 1; i >= 0; i--){
	        if (this._currentCollisionPairs[i][0] === entity ||
	           this._currentCollisionPairs[i][1] === entity) {
	          this._currentCollisionPairs.splice(i, 1);
	        }
	      }
	    },

	    isColliding: function(obj1, obj2) {
	      return obj1 !== obj2 &&
	        isSetupForCollisions(obj1) &&
	        isSetupForCollisions(obj2) &&
	        this.isIntersecting(obj1, obj2);
	    },

	    isIntersecting: function(obj1, obj2) {
	      var obj1BoundingBox = getBoundingBox(obj1);
	      var obj2BoundingBox = getBoundingBox(obj2);

	      if (obj1BoundingBox === this.RECTANGLE && obj2BoundingBox === this.RECTANGLE) {
	        return Maths.rectanglesIntersecting(obj1, obj2);
	      } else if (obj1BoundingBox === this.CIRCLE && obj2BoundingBox === this.RECTANGLE) {
	        return Maths.circleAndRectangleIntersecting(obj1, obj2);
	      } else if (obj1BoundingBox === this.RECTANGLE && obj2BoundingBox === this.CIRCLE) {
	        return Maths.circleAndRectangleIntersecting(obj2, obj1);
	      } else if (obj1BoundingBox === this.CIRCLE && obj2BoundingBox === this.CIRCLE) {
	        return Maths.circlesIntersecting(obj1, obj2);
	      } else {
	        throw "Objects being collision tested have unsupported bounding box types."
	      }
	    },

	    RECTANGLE: 0,
	    CIRCLE: 1
	  };

	  var getBoundingBox = function(obj) {
	    return obj.boundingBox || Collider.prototype.RECTANGLE;
	  };

	  var notifyEntityOfCollision = function(entity, other) {
	    if (entity.collision !== undefined) {
	      entity.collision(other);
	    }
	  };

	  var rotated = function(obj) {
	    return obj.angle !== undefined && obj.angle !== 0;
	  };

	  var getAngle = function(obj) {
	    return obj.angle === undefined ? 0 : obj.angle;
	  };

	  var Maths = {
	    circlesIntersecting: function(obj1, obj2) {
	      return Maths.distance(obj1.center, obj2.center) <
	        obj1.size.x / 2 + obj2.size.x / 2;
	    },

	    rectanglesIntersecting: function(obj1, obj2) {
	      if (!rotated(obj1) && !rotated(obj2)) {
	        return this.unrotatedRectanglesIntersecting(obj1, obj2); // faster
	      } else {
	        return this.rotatedRectanglesIntersecting(obj1, obj2); // slower
	      }
	    },

	    circleAndRectangleIntersecting: function(circleObj, rectangleObj) {
	      var rectangleObjAngleRad = -getAngle(rectangleObj) * Maths.RADIANS_TO_DEGREES;

	      var unrotatedCircleCenter = {
	        x: Math.cos(rectangleObjAngleRad) *
	          (circleObj.center.x - rectangleObj.center.x) -
	          Math.sin(rectangleObjAngleRad) *
	          (circleObj.center.y - rectangleObj.center.y) + rectangleObj.center.x,
	        y: Math.sin(rectangleObjAngleRad) *
	          (circleObj.center.x - rectangleObj.center.x) +
	          Math.cos(rectangleObjAngleRad) *
	          (circleObj.center.y - rectangleObj.center.y) + rectangleObj.center.y
	      };

	      var closest = { x: 0, y: 0 };

	      if (unrotatedCircleCenter.x < rectangleObj.center.x - rectangleObj.size.x / 2) {
	        closest.x = rectangleObj.center.x - rectangleObj.size.x / 2;
	      } else if (unrotatedCircleCenter.x > rectangleObj.center.x + rectangleObj.size.x / 2) {
	        closest.x = rectangleObj.center.x + rectangleObj.size.x / 2;
	      } else {
	        closest.x = unrotatedCircleCenter.x;
	      }

	      if (unrotatedCircleCenter.y < rectangleObj.center.y - rectangleObj.size.y / 2) {
	        closest.y = rectangleObj.center.y - rectangleObj.size.y / 2;
	      } else if (unrotatedCircleCenter.y > rectangleObj.center.y + rectangleObj.size.y / 2) {
	        closest.y = rectangleObj.center.y + rectangleObj.size.y / 2;
	      } else {
	        closest.y = unrotatedCircleCenter.y;
	      }

	      return this.distance(unrotatedCircleCenter, closest) < circleObj.size.x / 2;
	    },

	    unrotatedRectanglesIntersecting: function(obj1, obj2) {
	      if(obj1.center.x + obj1.size.x / 2 < obj2.center.x - obj2.size.x / 2) {
	        return false;
	      } else if(obj1.center.x - obj1.size.x / 2 > obj2.center.x + obj2.size.x / 2) {
	        return false;
	      } else if(obj1.center.y - obj1.size.y / 2 > obj2.center.y + obj2.size.y / 2) {
	        return false;
	      } else if(obj1.center.y + obj1.size.y / 2 < obj2.center.y - obj2.size.y / 2) {
	        return false
	      } else {
	        return true;
	      }
	    },

	    rotatedRectanglesIntersecting: function(obj1, obj2) {
	      var obj1Normals = this.rectanglePerpendicularNormals(obj1);
	      var obj2Normals = this.rectanglePerpendicularNormals(obj2);

	      var obj1Corners = this.rectangleCorners(obj1);
	      var obj2Corners = this.rectangleCorners(obj2);

	      if (this.projectionsSeparate(
	        this.getMinMaxProjection(obj1Corners, obj1Normals[1]),
	        this.getMinMaxProjection(obj2Corners, obj1Normals[1]))) {
	        return false;
	      } else if (this.projectionsSeparate(
	        this.getMinMaxProjection(obj1Corners, obj1Normals[0]),
	        this.getMinMaxProjection(obj2Corners, obj1Normals[0]))) {
	        return false;
	      } else if (this.projectionsSeparate(
	        this.getMinMaxProjection(obj1Corners, obj2Normals[1]),
	        this.getMinMaxProjection(obj2Corners, obj2Normals[1]))) {
	        return false;
	      } else if (this.projectionsSeparate(
	        this.getMinMaxProjection(obj1Corners, obj2Normals[0]),
	        this.getMinMaxProjection(obj2Corners, obj2Normals[0]))) {
	        return false;
	      } else {
	        return true;
	      }
	    },

	    pointInsideObj: function(point, obj) {
	      var objBoundingBox = getBoundingBox(obj);

	      if (objBoundingBox === Collider.prototype.RECTANGLE) {
	        return this.pointInsideRectangle(point, obj);
	      } else if (objBoundingBox === Collider.prototype.CIRCLE) {
	        return this.pointInsideCircle(point, obj);
	      } else {
	        throw "Tried to see if point inside object with unsupported bounding box.";
	      }
	    },

	    pointInsideRectangle: function(point, obj) {
	      var c = Math.cos(-getAngle(obj) * Maths.RADIANS_TO_DEGREES);
	      var s = Math.sin(-getAngle(obj) * Maths.RADIANS_TO_DEGREES);

	      var rotatedX = obj.center.x + c *
	          (point.x - obj.center.x) - s * (point.y - obj.center.y);
	      var rotatedY = obj.center.y + s *
	          (point.x - obj.center.x) + c * (point.y - obj.center.y);

	      var leftX = obj.center.x - obj.size.x / 2;
	      var rightX = obj.center.x + obj.size.x / 2;
	      var topY = obj.center.y - obj.size.y / 2;
	      var bottomY = obj.center.y + obj.size.y / 2;

	      return leftX <= rotatedX && rotatedX <= rightX &&
	        topY <= rotatedY && rotatedY <= bottomY;
	    },

	    pointInsideCircle: function(point, obj) {
	      return this.distance(point, obj.center) <= obj.size.x / 2;
	    },

	    distance: function(point1, point2) {
	      var x = point1.x - point2.x;
	      var y = point1.y - point2.y;
	      return Math.sqrt((x * x) + (y * y));
	    },

	    vectorTo: function(start, end) {
	      return {
	        x: end.x - start.x,
	        y: end.y - start.y
	      };
	    },

	    magnitude: function(vector) {
	      return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
	    },

	    leftNormalizedNormal: function(vector) {
	      return {
	        x: -vector.y,
	        y: vector.x
	      };
	    },

	    dotProduct: function(vector1, vector2) {
	      return vector1.x * vector2.x + vector1.y * vector2.y;
	    },

	    unitVector: function(vector) {
	      return {
	        x: vector.x / Maths.magnitude(vector),
	        y: vector.y / Maths.magnitude(vector)
	      };
	    },

	    projectionsSeparate: function(proj1, proj2) {
	      return proj1.max < proj2.min || proj2.max < proj1.min;
	    },

	    getMinMaxProjection: function(objCorners, normal) {
	      var min = Maths.dotProduct(objCorners[0], normal);
	      var max = Maths.dotProduct(objCorners[0], normal);

	      for (var i = 1; i < objCorners.length; i++) {
	        var current = Maths.dotProduct(objCorners[i], normal);
	        if (min > current) {
	          min = current;
	        }

	        if (current > max) {
	          max = current;
	        }
	      }

	      return { min: min, max: max };
	    },

	    rectangleCorners: function(obj) {
	      var corners = [ // unrotated
	        { x:obj.center.x - obj.size.x / 2, y: obj.center.y - obj.size.y / 2 },
	        { x:obj.center.x + obj.size.x / 2, y: obj.center.y - obj.size.y / 2 },
	        { x:obj.center.x + obj.size.x / 2, y: obj.center.y + obj.size.y / 2 },
	        { x:obj.center.x - obj.size.x / 2, y: obj.center.y + obj.size.y / 2 }
	      ];

	      var angle = getAngle(obj) * Maths.RADIANS_TO_DEGREES;

				for (var i = 0; i < corners.length; i++) {
					var xOffset = corners[i].x - obj.center.x;
					var yOffset = corners[i].y - obj.center.y;
					corners[i].x = obj.center.x +
	          xOffset * Math.cos(angle) - yOffset * Math.sin(angle);
					corners[i].y = obj.center.y +
	          xOffset * Math.sin(angle) + yOffset * Math.cos(angle);
				}

	      return corners;
	    },

	    rectangleSideVectors: function(obj) {
	      var corners = this.rectangleCorners(obj);
	      return [
	        { x: corners[0].x - corners[1].x, y: corners[0].y - corners[1].y },
	        { x: corners[1].x - corners[2].x, y: corners[1].y - corners[2].y },
	        { x: corners[2].x - corners[3].x, y: corners[2].y - corners[3].y },
	        { x: corners[3].x - corners[0].x, y: corners[3].y - corners[0].y }
	      ];
	    },

	    rectanglePerpendicularNormals: function(obj) {
	      var sides = this.rectangleSideVectors(obj);
	      return [
	        Maths.leftNormalizedNormal(sides[0]),
	        Maths.leftNormalizedNormal(sides[1])
	      ];
	    },

	    RADIANS_TO_DEGREES: 0.01745
	  };

	  exports.Collider = Collider;
	  exports.Collider.Maths = Maths;
	})( false ? this.Coquette : module.exports);

	;(function(exports) {
	  var Inputter = function(coquette, canvas, autoFocus) {
	    var keyboardReceiver = autoFocus === false ? canvas : window;
	    connectReceiverToKeyboard(keyboardReceiver, window, autoFocus);

	    this._buttonListener = new ButtonListener(canvas, keyboardReceiver);
	    this._mouseMoveListener = new MouseMoveListener(canvas);
	  };

	  Inputter.prototype = {
	    update: function() {
	      this._buttonListener.update();
	    },

	    // Returns true if passed button currently down
	    isDown: function(button) {
	      return this._buttonListener.isDown(button);
	    },

	    // Returns true if passed button just gone down. true once per keypress.
	    isPressed: function(button) {
	      return this._buttonListener.isPressed(button);
	    },

	    getEvents: function() {
	      return this._buttonListener.getEvents();
	    },

	    getMousePosition: function() {
	      return this._mouseMoveListener.getMousePosition();
	    },

	    // Returns true if passed button currently down
	    bindMouseMove: function(fn) {
	      return this._mouseMoveListener.bind(fn);
	    },

	    // Stops calling passed fn on mouse move
	    unbindMouseMove: function(fn) {
	      return this._mouseMoveListener.unbind(fn);
	    },

	    LEFT_MOUSE: "LEFT_MOUSE",
	    RIGHT_MOUSE: "RIGHT_MOUSE",

	    BACKSPACE: 8,
	    TAB: 9,
	    ENTER: 13,
	    SHIFT: 16,
	    CTRL: 17,
	    ALT: 18,
	    PAUSE: 19,
	    CAPS_LOCK: 20,
	    ESC: 27,
	    SPACE: 32,
	    PAGE_UP: 33,
	    PAGE_DOWN: 34,
	    END: 35,
	    HOME: 36,
	    LEFT_ARROW: 37,
	    UP_ARROW: 38,
	    RIGHT_ARROW: 39,
	    DOWN_ARROW: 40,
	    INSERT: 45,
	    DELETE: 46,
	    ZERO: 48,
	    ONE: 49,
	    TWO: 50,
	    THREE: 51,
	    FOUR: 52,
	    FIVE: 53,
	    SIX: 54,
	    SEVEN: 55,
	    EIGHT: 56,
	    NINE: 57,
	    A: 65,
	    B: 66,
	    C: 67,
	    D: 68,
	    E: 69,
	    F: 70,
	    G: 71,
	    H: 72,
	    I: 73,
	    J: 74,
	    K: 75,
	    L: 76,
	    M: 77,
	    N: 78,
	    O: 79,
	    P: 80,
	    Q: 81,
	    R: 82,
	    S: 83,
	    T: 84,
	    U: 85,
	    V: 86,
	    W: 87,
	    X: 88,
	    Y: 89,
	    Z: 90,
	    F1: 112,
	    F2: 113,
	    F3: 114,
	    F4: 115,
	    F5: 116,
	    F6: 117,
	    F7: 118,
	    F8: 119,
	    F9: 120,
	    F10: 121,
	    F11: 122,
	    F12: 123,
	    NUM_LOCK: 144,
	    SCROLL_LOCK: 145,
	    SEMI_COLON: 186,
	    EQUALS: 187,
	    COMMA: 188,
	    DASH: 189,
	    PERIOD: 190,
	    FORWARD_SLASH: 191,
	    GRAVE_ACCENT: 192,
	    OPEN_SQUARE_BRACKET: 219,
	    BACK_SLASH: 220,
	    CLOSE_SQUARE_BRACKET: 221,
	    SINGLE_QUOTE: 222
	  };

	  var ButtonListener = function(canvas, keyboardReceiver) {
	    var self = this;
	    this._buttonDownState = {};
	    this._buttonPressedState = {};
	    this._events = [];

	    keyboardReceiver.addEventListener('keydown', function(e) {
	      self._events.push(e);
	      self._down(e.keyCode);
	    }, false);

	    keyboardReceiver.addEventListener('keyup', function(e) {
	      self._events.push(e);
	      self._up(e.keyCode);
	    }, false);

	    canvas.addEventListener('mousedown', function(e) {
	      self._events.push(e);
	      self._down(self._getMouseButton(e));
	    }, false);

	    canvas.addEventListener('mouseup', function(e) {
	      self._events.push(e);
	      self._up(self._getMouseButton(e));
	    }, false);
	  };

	  ButtonListener.prototype = {
	    update: function() {
	      this._events.length = 0;
	      for (var i in this._buttonPressedState) {
	        if (this._buttonPressedState[i] === true) { // tick passed and press event in progress
	          this._buttonPressedState[i] = false; // end key press
	        }
	      }
	    },

	    _down: function(buttonId) {
	      this._buttonDownState[buttonId] = true;
	      if (this._buttonPressedState[buttonId] === undefined) { // start of new keypress
	        this._buttonPressedState[buttonId] = true; // register keypress in progress
	      }
	    },

	    _up: function(buttonId) {
	      this._buttonDownState[buttonId] = false;
	      if (this._buttonPressedState[buttonId] === false) { // prev keypress over
	        this._buttonPressedState[buttonId] = undefined; // prep for keydown to start next press
	      }
	    },

	    isDown: function(button) {
	      return this._buttonDownState[button] || false;
	    },

	    isPressed: function(button) {
	      return this._buttonPressedState[button] || false;
	    },

	    getEvents: function() {
	      return this._events;
	    },

	    _getMouseButton: function(e) {
	      if (e.which !== undefined || e.button !== undefined) {
	        if (e.which === 3 || e.button === 2) {
	          return Inputter.prototype.RIGHT_MOUSE;
	        } else if (e.which === 1 || e.button === 0 || e.button === 1) {
	          return Inputter.prototype.LEFT_MOUSE;
	        }
	      }

	      throw "Cannot judge button pressed on passed mouse button event";
	    }
	  };

	  var MouseMoveListener = function(canvas) {
	    this._bindings = [];
	    this._mousePosition;
	    var self = this;

	    canvas.addEventListener('mousemove', function(e) {
	      var absoluteMousePosition = self._getAbsoluteMousePosition(e);
	      var elementPosition = getElementPosition(canvas);
	      self._mousePosition = {
	        x: absoluteMousePosition.x - elementPosition.x,
	        y: absoluteMousePosition.y - elementPosition.y
	      };
	    }, false);

	    canvas.addEventListener('mousemove', function(e) {
	      for (var i = 0; i < self._bindings.length; i++) {
	        self._bindings[i](self.getMousePosition());
	      }
	    }, false);
	  };

	  MouseMoveListener.prototype = {
	    bind: function(fn) {
	      this._bindings.push(fn);
	    },

	    unbind: function(fn) {
	      for (var i = 0; i < this._bindings.length; i++) {
	        if (this._bindings[i] === fn) {
	          this._bindings.splice(i, 1);
	          return;
	        }
	      }

	      throw "Function to unbind from mouse moves was never bound";
	    },

	    getMousePosition: function() {
	      return this._mousePosition;
	    },

	    _getAbsoluteMousePosition: function(e) {
		    if (e.pageX) 	{
	        return { x: e.pageX, y: e.pageY };
		    } else if (e.clientX) {
	        return { x: e.clientX, y: e.clientY };
	      }
	    }
	  };

	  var getWindow = function(document) {
	    return document.parentWindow || document.defaultView;
	  };

	  var getElementPosition = function(element) {
	    var rect = element.getBoundingClientRect();
	    var document = element.ownerDocument;
	    var body = document.body;
	    var window = getWindow(document);
	    return {
	      x: rect.left + (window.pageXOffset || body.scrollLeft) - (body.clientLeft || 0),
	      y: rect.top + (window.pageYOffset || body.scrollTop) - (body.clientTop || 0)
	    };
	  };

	  var connectReceiverToKeyboard = function(keyboardReceiver, window, autoFocus) {
	    if (autoFocus === false) {
	      keyboardReceiver.contentEditable = true; // lets canvas get focus and get key events
	    } else {
	      var suppressedKeys = [
	        Inputter.prototype.SPACE,
	        Inputter.prototype.LEFT_ARROW,
	        Inputter.prototype.UP_ARROW,
	        Inputter.prototype.RIGHT_ARROW,
	        Inputter.prototype.DOWN_ARROW
	      ];

	      // suppress scrolling
	      window.addEventListener("keydown", function(e) {
	        for (var i = 0; i < suppressedKeys.length; i++) {
	          if(suppressedKeys[i] === e.keyCode) {
	            e.preventDefault();
	            return;
	          }
	        }
	      }, false);
	    }
	  };

	  exports.Inputter = Inputter;
	})( false ? this.Coquette : module.exports);

	;(function(exports) {
	  function Runner(coquette) {
	    this.c = coquette;
	    this._runs = [];
	  };

	  Runner.prototype = {
	    update: function() {
	      this.run();
	    },

	    run: function() {
	      while(this._runs.length > 0) {
	        var run = this._runs.shift();
	        run.fn(run.obj);
	      }
	    },

	    add: function(obj, fn) {
	      this._runs.push({
	        obj: obj,
	        fn: fn
	      });
	    }
	  };

	  exports.Runner = Runner;
	})( false ? this.Coquette : module.exports);

	;(function(exports) {
	  var interval = 16;

	  function Ticker(coquette, gameLoop) {
	    setupRequestAnimationFrame();

	    var nextTickFn;
	    this.stop = function() {
	      nextTickFn = function() {};
	    };

	    this.start = function() {
	      var prev = Date.now();
	      var tick = function() {
	        var now = Date.now();
	        var interval = now - prev;
	        prev = now;
	        gameLoop(interval);
	        requestAnimationFrame(nextTickFn);
	      };

	      nextTickFn = tick;
	      requestAnimationFrame(nextTickFn);
	    };

	    this.start();
	  };

	  // From: https://gist.github.com/paulirish/1579671
	  // Thanks Erik, Paul and Tino
	  var setupRequestAnimationFrame = function() {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
	        || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }

	    if (!window.requestAnimationFrame) {
	      window.requestAnimationFrame = function(callback, element) {
	        var currTime = Date.now();
	        var timeToCall = Math.max(0, interval - (currTime - lastTime));
	        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
	                                   timeToCall);
	        lastTime = currTime + timeToCall;
	        return id;
	      };
	    }

	    if (!window.cancelAnimationFrame) {
	      window.cancelAnimationFrame = function(id) {
	        clearTimeout(id);
	      };
	    }
	  };

	  exports.Ticker = Ticker;
	})( false ? this.Coquette : module.exports);

	;(function(exports) {
	  var Maths = exports.Collider.Maths;

	  var Renderer = function(coquette, game, canvas, wView, hView, backgroundColor) {
	    this.c = coquette;
	    this.game = game;
	    canvas.style.outline = "none"; // stop browser outlining canvas when it has focus
	    canvas.style.cursor = "default"; // keep pointer normal when hovering over canvas
	    this._ctx = canvas.getContext('2d');
	    this._backgroundColor = backgroundColor;

	    canvas.width = wView;
	    canvas.height = hView;
	    this._viewSize = { x:wView, y:hView };
	    this._viewCenter = { x: this._viewSize.x / 2, y: this._viewSize.y / 2 };
	    this._target = undefined;

	  };

	  Renderer.prototype = {
	    getCtx: function() {
	      return this._ctx;
	    },

	    getViewSize: function() {
	      return this._viewSize;
	    },

	    getViewCenter: function() {
	      return this._viewCenter;
	    },

	    setViewCenter: function(pos) {
	      this._viewCenter.x = pos.x;
	      this._viewCenter.y = pos.y;
	    },

	    follow: function(pos) {
	      this._target = pos;
	      this._viewCenter.x = pos.x;
	      this._viewCenter.y = pos.y;
	    },

	    unfollow: function() {
	      this._target = undefined;
	    },

	    setBackground: function(color) {
	      this._backgroundColor = color;
	    },

	    update: function(interval) {
	      var ctx = this.getCtx();

	      if (this._target) {
	          this._viewCenter.x = this._target.x;
	          this._viewCenter.y = this._target.y;
	      }

	      var viewTranslate = viewOffset(this._viewCenter, this._viewSize);

	      ctx.translate(viewTranslate.x, viewTranslate.y);

	      // draw background
	      var viewArgs = [
	            this._viewCenter.x - this._viewSize.x / 2,
	            this._viewCenter.y - this._viewSize.y / 2,
	            this._viewSize.x,
	            this._viewSize.y 
	      ]
	      if (this._backgroundColor !== undefined) {
	          ctx.fillStyle = this._backgroundColor;
	          ctx.fillRect.apply(ctx, viewArgs);
	      } else {
	          ctx.clearRect.apply(ctx, viewArgs);
	      }

	      // draw game and entities
	      var drawables = [this.game]
	        .concat(this.c.entities.all().sort(zindexSort));
	      for (var i = 0, len = drawables.length; i < len; i++) {
	        if (drawables[i].draw !== undefined) {
	          var drawable = drawables[i];

	          ctx.save();

	          if (drawable.center !== undefined && drawable.angle !== undefined) {
	            ctx.translate(drawable.center.x, drawable.center.y);
	            ctx.rotate(drawable.angle * Maths.RADIANS_TO_DEGREES);
	            ctx.translate(-drawable.center.x, -drawable.center.y);
	          }

	          drawables[i].draw(ctx);

	          ctx.restore();
	        }
	      }

	      ctx.translate(-viewTranslate.x, -viewTranslate.y);
	    },

	    onScreen: function(obj) {
	      return Maths.rectanglesIntersecting(obj, {
	        size: this._viewSize,
	        center: {
	          x: this._viewCenter.x,
	          y: this._viewCenter.y
	        }
	      });
	    }
	  };

	  var viewOffset = function(viewCenter, viewSize) {
	    return {
	      x: -(viewCenter.x - viewSize.x / 2),
	      y: -(viewCenter.y - viewSize.y / 2)
	    }
	  };

	  // sorts passed array by zindex
	  // elements with a higher zindex are drawn on top of those with a lower zindex
	  var zindexSort = function(a, b) {
	    return (a.zindex || 0) < (b.zindex || 0) ? -1 : 1;
	  };

	  exports.Renderer = Renderer;
	})( false ? this.Coquette : module.exports);

	;(function(exports) {
	  function Entities(coquette, game) {
	    this.c = coquette;
	    this.game = game;
	    this._entities = [];
	  };

	  Entities.prototype = {
	    update: function(interval) {
	      var entities = this.all();
	      for (var i = 0, len = entities.length; i < len; i++) {
	        if (entities[i].update !== undefined) {
	          entities[i].update(interval);
	        }
	      }
	    },

	    all: function(Constructor) {
	      if (Constructor === undefined) {
	        return this._entities.slice(); // return shallow copy of array
	      } else {
	        var entities = [];
	        for (var i = 0; i < this._entities.length; i++) {
	          if (this._entities[i] instanceof Constructor) {
	            entities.push(this._entities[i]);
	          }
	        }

	        return entities;
	      }
	    },

	    create: function(Constructor, settings) {
	      var entity = new Constructor(this.game, settings || {});
	      this.c.collider.createEntity(entity);
	      this._entities.push(entity);
	      return entity;
	    },

	    destroy: function(entity) {
	      for(var i = 0; i < this._entities.length; i++) {
	        if(this._entities[i] === entity) {
	          this.c.collider.destroyEntity(entity);
	          this._entities.splice(i, 1);
	          break;
	        }
	      }
	    }
	  };

	  exports.Entities = Entities;
	})( false ? this.Coquette : module.exports);



/***/ },
/* 2 */
/***/ function(module, exports) {

	var Timer = function() {
	    this.time = 0;
	    this.callbacks = [];
	};

	Timer.prototype = {
	    update: function(delta) {
	        var self = this;

	        this.time += delta;

	        if (this.callbacks) {
	            this.callbacks.forEach(function(cbObj) {
	                if (self.time - cbObj.lastTime >=
	                        cbObj.interval) {
	                    cbObj.callback();
	                    cbObj.lastTime = self.time;
	                }
	            });
	        }
	    },
	    getTime: function() {
	        return this.time;
	    },
	    reset: function() {
	        this.time = 0;
	    },
	    every: function(interval, callback) {
	        this.callbacks.push({
	            interval : interval,
	            callback : callback,
	            lastTime : 0
	        });
	    }
	};

	module.exports = Timer;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var visible = __webpack_require__(4);
	var Pauser = function(game, modules) {

	    var self = this;

	    this.paused = false;
	    this.backups = [];

	    // Toggle pause on P down
	    window.addEventListener("keydown", function(e) {
	        if (e.keyCode == 80)
	            self.toggle();
	    }, false);

	    // Pause on tab switch, leaving window;
	    visible.on("blur", function() {
	        self.pause();
	    });

	    this.toggle = function() {
	        if (this.paused)
	            this.unpause();
	        else
	            this.pause();
	    };

	    this.isPaused = function() {
	        return this.paused;
	    };

	    this.pause = function() {
	        var self = this;

	        if (this.paused)
	            return;

	        this.backups = [];
	        modules.forEach(function(m) {
	            self.backups.push(m.update);
	            m.update = function(){};
	        });
	        this.paused = true;
	    };
	    this.unpause = function() {
	        var self = this;

	        if (!this.paused)
	            return;

	        this.backups.forEach(function(update, i) {
	            modules[i].update = update;
	        });
	        this.paused = false;
	    };

	};

	module.exports = Pauser;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;(function() {
	  (function(root, factory) {
	    if (true) {
	      return !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	        return factory();
	      }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	      return module.exports = factory();
	    } else {
	      return root.ifvisible = factory();
	    }
	  })(this, function() {
	    var addEvent, customEvent, doc, fireEvent, hidden, idleStartedTime, idleTime, ie, ifvisible, init, initialized, status, trackIdleStatus, visibilityChange;
	    ifvisible = {};
	    doc = document;
	    initialized = false;
	    status = "active";
	    idleTime = 60000;
	    idleStartedTime = false;
	    customEvent = (function() {
	      var S4, addCustomEvent, cgid, fireCustomEvent, guid, listeners, removeCustomEvent;
	      S4 = function() {
	        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	      };
	      guid = function() {
	        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
	      };
	      listeners = {};
	      cgid = '__ceGUID';
	      addCustomEvent = function(obj, event, callback) {
	        obj[cgid] = undefined;
	        if (!obj[cgid]) {
	          obj[cgid] = "ifvisible.object.event.identifier";
	        }
	        if (!listeners[obj[cgid]]) {
	          listeners[obj[cgid]] = {};
	        }
	        if (!listeners[obj[cgid]][event]) {
	          listeners[obj[cgid]][event] = [];
	        }
	        return listeners[obj[cgid]][event].push(callback);
	      };
	      fireCustomEvent = function(obj, event, memo) {
	        var ev, j, len, ref, results;
	        if (obj[cgid] && listeners[obj[cgid]] && listeners[obj[cgid]][event]) {
	          ref = listeners[obj[cgid]][event];
	          results = [];
	          for (j = 0, len = ref.length; j < len; j++) {
	            ev = ref[j];
	            results.push(ev(memo || {}));
	          }
	          return results;
	        }
	      };
	      removeCustomEvent = function(obj, event, callback) {
	        var cl, i, j, len, ref;
	        if (callback) {
	          if (obj[cgid] && listeners[obj[cgid]] && listeners[obj[cgid]][event]) {
	            ref = listeners[obj[cgid]][event];
	            for (i = j = 0, len = ref.length; j < len; i = ++j) {
	              cl = ref[i];
	              if (cl === callback) {
	                listeners[obj[cgid]][event].splice(i, 1);
	                return cl;
	              }
	            }
	          }
	        } else {
	          if (obj[cgid] && listeners[obj[cgid]] && listeners[obj[cgid]][event]) {
	            return delete listeners[obj[cgid]][event];
	          }
	        }
	      };
	      return {
	        add: addCustomEvent,
	        remove: removeCustomEvent,
	        fire: fireCustomEvent
	      };
	    })();
	    addEvent = (function() {
	      var setListener;
	      setListener = false;
	      return function(el, ev, fn) {
	        if (!setListener) {
	          if (el.addEventListener) {
	            setListener = function(el, ev, fn) {
	              return el.addEventListener(ev, fn, false);
	            };
	          } else if (el.attachEvent) {
	            setListener = function(el, ev, fn) {
	              return el.attachEvent('on' + ev, fn, false);
	            };
	          } else {
	            setListener = function(el, ev, fn) {
	              return el['on' + ev] = fn;
	            };
	          }
	        }
	        return setListener(el, ev, fn);
	      };
	    })();
	    fireEvent = function(element, event) {
	      var evt;
	      if (doc.createEventObject) {
	        return element.fireEvent('on' + event, evt);
	      } else {
	        evt = doc.createEvent('HTMLEvents');
	        evt.initEvent(event, true, true);
	        return !element.dispatchEvent(evt);
	      }
	    };
	    ie = (function() {
	      var all, check, div, undef, v;
	      undef = void 0;
	      v = 3;
	      div = doc.createElement("div");
	      all = div.getElementsByTagName("i");
	      check = function() {
	        return (div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->", all[0]);
	      };
	      while (check()) {
	        continue;
	      }
	      if (v > 4) {
	        return v;
	      } else {
	        return undef;
	      }
	    })();
	    hidden = false;
	    visibilityChange = void 0;
	    if (typeof doc.hidden !== "undefined") {
	      hidden = "hidden";
	      visibilityChange = "visibilitychange";
	    } else if (typeof doc.mozHidden !== "undefined") {
	      hidden = "mozHidden";
	      visibilityChange = "mozvisibilitychange";
	    } else if (typeof doc.msHidden !== "undefined") {
	      hidden = "msHidden";
	      visibilityChange = "msvisibilitychange";
	    } else if (typeof doc.webkitHidden !== "undefined") {
	      hidden = "webkitHidden";
	      visibilityChange = "webkitvisibilitychange";
	    }
	    trackIdleStatus = function() {
	      var timer, wakeUp;
	      timer = false;
	      wakeUp = function() {
	        clearTimeout(timer);
	        if (status !== "active") {
	          ifvisible.wakeup();
	        }
	        idleStartedTime = +(new Date());
	        return timer = setTimeout(function() {
	          if (status === "active") {
	            return ifvisible.idle();
	          }
	        }, idleTime);
	      };
	      wakeUp();
	      addEvent(doc, "mousemove", wakeUp);
	      addEvent(doc, "keyup", wakeUp);
	      addEvent(window, "scroll", wakeUp);
	      ifvisible.focus(wakeUp);
	      return ifvisible.wakeup(wakeUp);
	    };
	    init = function() {
	      var blur;
	      if (initialized) {
	        return true;
	      }
	      if (hidden === false) {
	        blur = "blur";
	        if (ie < 9) {
	          blur = "focusout";
	        }
	        addEvent(window, blur, function() {
	          return ifvisible.blur();
	        });
	        addEvent(window, "focus", function() {
	          return ifvisible.focus();
	        });
	      } else {
	        addEvent(doc, visibilityChange, function() {
	          if (doc[hidden]) {
	            return ifvisible.blur();
	          } else {
	            return ifvisible.focus();
	          }
	        }, false);
	      }
	      initialized = true;
	      return trackIdleStatus();
	    };
	    ifvisible = {
	      setIdleDuration: function(seconds) {
	        return idleTime = seconds * 1000;
	      },
	      getIdleDuration: function() {
	        return idleTime;
	      },
	      getIdleInfo: function() {
	        var now, res;
	        now = +(new Date());
	        res = {};
	        if (status === "idle") {
	          res.isIdle = true;
	          res.idleFor = now - idleStartedTime;
	          res.timeLeft = 0;
	          res.timeLeftPer = 100;
	        } else {
	          res.isIdle = false;
	          res.idleFor = now - idleStartedTime;
	          res.timeLeft = (idleStartedTime + idleTime) - now;
	          res.timeLeftPer = (100 - (res.timeLeft * 100 / idleTime)).toFixed(2);
	        }
	        return res;
	      },
	      focus: function(callback) {
	        if (typeof callback === "function") {
	          return this.on("focus", callback);
	        }
	        status = "active";
	        customEvent.fire(this, "focus");
	        customEvent.fire(this, "wakeup");
	        return customEvent.fire(this, "statusChanged", {
	          status: status
	        });
	      },
	      blur: function(callback) {
	        if (typeof callback === "function") {
	          return this.on("blur", callback);
	        }
	        status = "hidden";
	        customEvent.fire(this, "blur");
	        customEvent.fire(this, "idle");
	        return customEvent.fire(this, "statusChanged", {
	          status: status
	        });
	      },
	      idle: function(callback) {
	        if (typeof callback === "function") {
	          return this.on("idle", callback);
	        }
	        status = "idle";
	        customEvent.fire(this, "idle");
	        return customEvent.fire(this, "statusChanged", {
	          status: status
	        });
	      },
	      wakeup: function(callback) {
	        if (typeof callback === "function") {
	          return this.on("wakeup", callback);
	        }
	        status = "active";
	        customEvent.fire(this, "wakeup");
	        return customEvent.fire(this, "statusChanged", {
	          status: status
	        });
	      },
	      on: function(name, callback) {
	        init();
	        return customEvent.add(this, name, callback);
	      },
	      off: function(name, callback) {
	        init();
	        return customEvent.remove(this, name, callback);
	      },
	      onEvery: function(seconds, callback) {
	        var paused, t;
	        init();
	        paused = false;
	        if (callback) {
	          t = setInterval(function() {
	            if (status === "active" && paused === false) {
	              return callback();
	            }
	          }, seconds * 1000);
	        }
	        return {
	          stop: function() {
	            return clearInterval(t);
	          },
	          pause: function() {
	            return paused = true;
	          },
	          resume: function() {
	            return paused = false;
	          },
	          code: t,
	          callback: callback
	        };
	      },
	      now: function(check) {
	        init();
	        return status === (check || "active");
	      }
	    };
	    return ifvisible;
	  });

	}).call(this);

	//# sourceMappingURL=ifvisible.js.map


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(6).assert;
	var G = __webpack_require__(7);

	/*
	 * THE SCENER API:

	   // Advance next scene
	   scener.start(NextSceneConstructor);

	   // Advance a temporary scene
	   scener.push();

	   // Leave a temporary scene
	   scener.pop();

	 * EXAMPLES:

	   // Lalala start the main game
	   scener.push(MainGameScene);

	   // When pause is pressed
	   scener.push(PauseMenu);
	        
	       // When controls is pressed
	       scener.push(PauseControlsSubMenu);

	       // When back is pressed
	       scener.pop();
	       
	   // When back is pressed
	   scener.pop();

	*/
	var Scener = function(game) {
	    this.stack = [];
	    this.game = game;
	    this.cur;
	}

	Scener.prototype.start = function(scene, settings) {
	    // Pop will throw an err if length is 0,
	    // this check ensures that calls to start never throw the error 
	    // (calling start for the first time) 
	    // while user errors (calling pop too many times) are raised
	    if (this.stack.length) 
	        this.pop();
	    this.push(scene, settings);
	};

	Scener.prototype.push = function(scene, settings) {
	    var s = new scene(this.game, settings);

	    // Provide defaults for necessary functions
	    ["init", "active", "update", "exit"].forEach(function(func) {
	        if (func in s)
	            return;

	        if (func == "active")
	            s[func] = getTrue;
	        else
	            s[func] = doNothing;
	    });

	    s.init();
	    this.stack.push(s);
	};

	Scener.prototype.pop = function() {
	    assert("Cannot pop without a previous scene", this.stack.length);
	    this.stack.pop();
	};

	Scener.prototype.update = function(delta) {

	    // Save quick refs
	    var cur, stack = this.stack;
	    
	    // Update current scene
	    cur = this.cur = stack[stack.length - 1];

	    if (cur.active()) {
	        cur.update(delta);
	        assert("A scene must change scenes in exit()", 
	                cur == stack[stack.length - 1]);
	    } else {
	        cur.exit();
	        assert("An inactive scene must change scenes in exit()",
	                cur != stack[this.stack.length - 1]);
	    }
	};

	var doNothing = function() {};
	var getTrue = function() { return true; };

	module.exports = Scener;


/***/ },
/* 6 */
/***/ function(module, exports) {

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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var deepFreeze = __webpack_require__(6).deepFreeze;

	module.exports = {
	    DEBUG: false,
	    Game: {
	        width: 800,
	        height: 400,
	        color:"#efefef"
	    },
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	

	var Scorer = function(game) {

	    var score = 0;

	    this.add = function(n) {
	        score += n;
	    };

	    this.get = function() {
	        return score;
	    };

	    this.reset = function() {
	        score = 0;
	    };
	};

	module.exports = Scorer;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Wall         = __webpack_require__(10);
	var Player       = __webpack_require__(11);
	var Micro        = __webpack_require__(18);
	var Avoid        = __webpack_require__(15);
	var TextBox      = __webpack_require__(19);
	var Global       = __webpack_require__(7);
	var R            = __webpack_require__(14);
	var Wave1        = __webpack_require__(20);
	var Utils        = __webpack_require__(6);

	var Splash = function (game) {
	    this.game = game;
	    this.c = game.c;
	};

	Splash.prototype = {
	    init: function() {
	        makeFoo.bind(this)();
	        this.c.entities.create(TextBox, {
	            text: "Press S to start", 
	            x: 325, y: 300
	        });
	        Wall.makeBoundaries(this);   
	    },
	    active:function() {
	        var In = this.c.inputter;
	        return !In.isDown(In.S);;
	    },
	    exit: function() {
	        var self = this;
	        var destroy = this.c.entities.destroy.bind(this.c.entities);
	        var length = this.c.entities.all(Micro).length; 

	        // Destroy all created entities
	        ([Micro, Wall, TextBox]).forEach(function(type){
	            self.c.entities.all(type).forEach(destroy);
	        });
	        this.game.scener.start(Wave1);
	    }
	};

	var makeFoo = function(){
	    for(var i = 0; i < 20; i++){
	        this.c.entities.create(Micro, {
	            center: {x: 0, y: 0},
	            speed: 100/17,
	            away: 0,
	            within: 0,
	            jitter: 0.02,
	            target: {center:{x: 300 + 3*i, y: 100}}
	        });
	    }
	    for(var i = 0; i < 30; i++){
	        this.c.entities.create(Micro, {
	            center: {x: 0, y: 0},
	            speed: 100/17,
	            away: 0,
	            within: 0,
	            jitter: 0.02,
	            target: {center:{x: 300, y: 100 + 4*i}}
	        });
	    }
	    for(var i = 0; i < 20; i++){
	        this.c.entities.create(Micro, {
	            center: {x: 0, y: 0},
	            speed: 100/17,
	            away: 0,
	            within: 0,
	            jitter: 0.02,
	            target: {center:{x: 300 + 3*i, y: 160}}
	        });
	    }

	    // o
	    for(var i = 0; i < 32; i++){
	        var x = 410 + 35 * Math.cos((360/32) * i),
	            y = 180 + 35 * Math.sin((360/32) * i);

	        this.c.entities.create(Micro, {
	            center: {x: 0, y: 0},
	            speed: 100/17,
	            away: 0,
	            within: 0,
	            jitter: 0.02,
	            target: {center:{x: x , y: y}}
	        });
	    }
	    for(var i = 0; i < 32; i++){
	        var x = 500 + 35 * Math.cos((360/32) * i),
	            y = 180 + 35 * Math.sin((360/32) * i);

	        this.c.entities.create(Micro, {
	            center: {x: 0, y: 0},
	            speed: 100/17,
	            away: 0,
	            within: 0,
	            jitter: 0.02,
	            target: {center:{x: x , y: y}}
	        });
	    }
	};

	module.exports = Splash;


/***/ },
/* 10 */
/***/ function(module, exports) {

	// A wall is a simple boundary for the bounds of the world
	//
	// If a player collides with a wall and calls alignPlayer passing itself
	// then that player will be be moved. If wall.type == Wall.RIGHT, then the
	// character will be moved to the left side of the wall, etc.

	var Wall = function(game, settings) {

	    if (settings.type === undefined ||
	            settings.target === undefined) {
	        throw("Error: Wall settings must include target, and type");
	    }

	    var target = settings.target;

	    for (var i in settings) {
	        this[i] = settings[i];
	    }

	    // defaults.shift brings the wall closer to the target by 'shift'
	    // pixels, useful in accounting for the player's strokewidth (which
	    // increases the player's perceived size). It might be better to
	    // remove that illusion.
	    var defaults = {
	        width : 50,
	        shift : 2
	    };

	    this.boundingBox = game.c.collider.RECTANGLE;
	    this.center = { x: 0, y: 0 };
	    this.size = { x: 0, y: 0 };
	    this.color = "#f00";

	    if (this.type == Wall.LEFT) {
	        this.center.x =
	            target.center.x - target.size.x / 2 - defaults.width / 2 + defaults.shift;
	        this.center.y = target.center.y;
	        this.size.x = defaults.width;
	        this.size.y = target.size.y;
	    } else if (this.type == Wall.RIGHT) {
	        this.center.x =
	            target.center.x + target.size.x / 2 + defaults.width / 2 - defaults.shift;
	        this.center.y = target.center.y;
	        this.size.x = defaults.width;
	        this.size.y = target.size.y;
	    } else if (this.type == Wall.TOP) {
	        this.center.x = target.center.x;
	        this.center.y =
	            target.center.y - target.size.y / 2 - defaults.width / 2 + defaults.shift;
	        this.size.x = target.size.x;
	        this.size.y = defaults.width;
	    } else if (this.type == Wall.BOTTOM) {
	        this.center.x = target.center.x;
	        this.center.y =
	            target.center.y + target.size.y / 2 + defaults.width / 2 - defaults.shift;
	        this.size.x = target.size.x;
	        this.size.y = defaults.width;
	    }


	    // this.draw = function(ctx) {
	    //     if (Global.DEBUG)
	    //         drawRect(this, ctx, this.color);
	    // }

	};

	Wall.prototype = {};
	Wall.prototype.alignPlayer = function(player) {
	    // console.log("alignPlayer");
	    if (this.type == Wall.LEFT)
	        player.center.x = this.center.x + this.size.x / 2 + player.size.x / 2;
	    else if (this.type == Wall.RIGHT)
	        player.center.x = this.center.x - this.size.x / 2 - player.size.x / 2;
	    else if (this.type == Wall.TOP)
	        player.center.y = this.center.y + this.size.y / 2 + player.size.y / 2;
	    else if (this.type == Wall.BOTTOM)
	        player.center.y = this.center.y - this.size.y / 2 - player.size.y / 2;
	};

	// Convenience method to make four walls around world(view)
	Wall.makeBoundaries = function(game) {
	    var c = game.c;
	    var target = {
	        center : c.renderer.getViewCenter(),
	        size : c.renderer.getViewSize()
	    };
	    c.entities.create(Wall, {
	        type: Wall.LEFT,
	        target: target
	    });
	    c.entities.create(Wall, {
	        type: Wall.RIGHT,
	        target: target
	    });
	    c.entities.create(Wall, {
	        type: Wall.TOP,
	        target: target
	    });
	    c.entities.create(Wall, {
	        type: Wall.BOTTOM,
	        target: target
	    });
	};

	Wall.LEFT   = 0;
	Wall.RIGHT  = 1;
	Wall.TOP    = 2;
	Wall.BOTTOM = 3;

	module.exports = Wall;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Bullet = __webpack_require__(12);
	var Config = __webpack_require__(17);
	var Global = __webpack_require__(7);
	var R = __webpack_require__(14);
	var Sprite = __webpack_require__(13);
	var Utils = __webpack_require__(6);
	var Wall = __webpack_require__(10);

	var Player = function(game, settings) {

	    this.c = game.c;

	    // Config
	    Utils.extend(Utils.extend(this, Config.Player), settings.Player);
	    Utils.extend(this, Sprite, ["drawCircle"]);

	    // Bullet config
	    var bsettings =
	        Utils.extend(Utils.extend({}, Config.Bullet), settings.Bullet);

	    // State
	    this.lastBullet = 0;
	    this.boundingBox = game.c.collider.CIRCLE;
	    this.vel = { x: 0, y: 0 };
	    this.center = { x: 400, y: 200 };

	    this.update = function(delta) {
	        this.move(delta);
	        this.shoot(delta);
	    };

	    this.move = function(delta) {

	        var Input = game.c.inputter;

	        // The direction of motion
	        var xdir, ydir;
	        xdir = (Input.isDown(Input.D) ? 1 : (Input.isDown(Input.A) ? -1 : 0));
	        ydir = (Input.isDown(Input.S) ? 1 : (Input.isDown(Input.W) ? -1 : 0));

	        // The diffs of initial/final player position
	        // theta is the angle of motion relative to the ground
	        var x, y, h, theta;
	        h = this.speed / 17;
	        theta = Math.atan2(ydir, xdir);
	        this.vel.x = h * Math.cos(theta) * (xdir === 0 ? 0 : 1);
	        this.vel.y = h * Math.sin(theta);

	        this.center.x += this.vel.x * delta;
	        this.center.y += this.vel.y * delta;

	        // Force player coordinates within world
	        this.restrict();
	    };

	    this.restrict = function() {

	        // min/max values for player location in world
	        var minx, maxx, miny, maxy;

	        // pad accounts for the stroke width affecting player dimensions
	        var pad = 3;

	        maxx = Global.Game.width - this.size.x / 2 - pad;
	        minx = this.size.x / 2 + pad;
	        maxy = Global.Game.height - this.size.x / 2 - pad;
	        miny = this.size.x / 2 + pad;
	        this.center.x = Math.max(Math.min(this.center.x, maxx), minx);
	        this.center.y = Math.max(Math.min(this.center.y, maxy), miny);
	    };

	    this.shoot = function(delta) {

	        var Input = game.c.inputter;

	        // The direction of bullet attack
	        var left, right, down, up;
	        left = Input.isDown(Input.LEFT_ARROW) || Input.isDown(Input.H);
	        right = Input.isDown(Input.RIGHT_ARROW) || Input.isDown(Input.L);
	        up = Input.isDown(Input.UP_ARROW) || Input.isDown(Input.K);
	        down = Input.isDown(Input.DOWN_ARROW) || Input.isDown(Input.J);

	        var bxdir, bydir, btheta;
	        bxdir = (right ? 1 : left ? -1 : 0);
	        bydir = (down ? 1 : up ? -1 : 0);
	        btheta = Math.atan2(bydir, bxdir);

	        // If gun has direction, shoot
	        if (bxdir || bydir) {
	            if ((game.timer.getTime() - this.lastBullet) > bsettings.delay) {
	                this.lastBullet = game.timer.getTime();

	                var any =  R.any(-1, 1);
	                var xtheta = btheta + (R.scale(bsettings.disorder) * any );
	                var xcomp = Math.cos(xtheta);
	                var ycomp = Math.sin(btheta + (R.scale(bsettings.disorder) * R.any(-1, 1)));

	                Utils.extend(bsettings, {
	                    center: {
	                        x: this.center.x,
	                        y: this.center.y,
	                    },
	                    vel: {
	                        x: bsettings.speed / 17 * xcomp,
	                        y: bsettings.speed / 17 * ycomp,
	                    }
	                });
	                game.c.entities.create(Bullet, bsettings);
	            }
	        }

	    };

	    this.collision = function(other) {
	        // if (!(other instanceof Wall ||
	        //       other instanceof Bullet)) {
	        //     game.c.entities.destroy(this);
	        //     if (Global.DEBUG) {
	        //         other.color = "#f00";
	        //         other.draw(this.c.renderer.getCtx());
	        //         // this.color = "#0f0";
	        //         // this.draw(this.c.renderer.getCtx());
	        //     }
	        // }
	    };

	    this.draw = function(ctx) {
	        ctx.strokeStyle = this.color || "#f00";
	        ctx.lineWidth = 4;
	        this.drawCircle(ctx, this.size.x / 2 - 1);
	    };

	};
	module.exports = Player;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Player = __webpack_require__(11);
	var Sprite = __webpack_require__(13);
	var Utils = __webpack_require__(6);

	var Bullet = function(game, settings) {

	    this.c = game.c;

	    // Note: Player is a circular dependency
	    Player = __webpack_require__(11);
	    Avoid = __webpack_require__(15);

	    Utils.extend(this, Sprite, ["drawFilledCircle"]);
	    Utils.extend(this, {
	        size: {x: 5, y: 5},
	        color : "#000",
	        boundingBox : game.c.collider.CIRCLE,
	    });
	    Utils.extend(this, settings);

	    Utils.assert("Bullet requires a velocity from settings", this.vel);
	};

	Bullet.prototype = {};

	Bullet.prototype.update = function(delta) {
	    // console.log(this.center, this.vel);
	    this.center.x += this.vel.x * delta;
	    this.center.y += this.vel.y * delta;
	};

	Bullet.prototype.collision = function(other) {
	    if (!(other instanceof Bullet) &&
	            !(other instanceof Avoid)  &&
	            !(other instanceof Player)) {
	        this.c.entities.destroy(this);
	    }
	};

	Bullet.prototype.draw = function(ctx) {
	    ctx.fillStyle = this.color || "#f00";
	    this.drawFilledCircle(ctx, this.size.x / 2);
	};

	module.exports = Bullet;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var R = __webpack_require__(14);
	var Utils = __webpack_require__(6);

	var Sprite = {};
	Sprite.drawRect = function(ctx) {
	    var color = this.color || "#fff";
	    ctx.fillStyle = color;

	    var x, y, w, h;
	    x = this.center.x - this.size.x/2;
	    y = this.center.y - this.size.y/2;
	    w = this.size.x;
	    h = this.size.y;

	    ctx.fillRect(x, y, w, h);
	};

	Sprite.drawPoint = function(ctx, width) {
	    var color = this.color || "#fff";
	    width = width || 2;
	    ctx.fillStyle = color;

	    var x, y, w, h;
	    x = this.center.x - width/2;
	    y = this.center.y - width/2;
	    w = h = width;

	    ctx.fillRect(x, y, w, h);
	};

	Sprite.drawCircle = function(ctx, radius) {
	    ctx.beginPath();
	    ctx.arc(this.center.x,
	            this.center.y,
	            radius,
	            0,
	            2 * Math.PI);
	    ctx.stroke();
	};

	Sprite.drawFilledCircle = function(ctx, radius) {

	    var color = this.color || "#fff";
	    ctx.fillStyle = color;

	    radius = radius || this.size.x / 2;
	    ctx.beginPath();
	    ctx.arc(this.center.x,
	            this.center.y,
	            radius,
	            0,
	            2 * Math.PI);
	    ctx.fill();
	};

	Sprite.follow = function(target, settings) {

	    settings = settings || {};

	    // If this is in the "within" distance from the target, it will
	    // repel. "jitter" introduces randomness into the motion.
	    var within = settings.within || this.within || 0;
	    var jitter = Math.min(settings.jitter || this.jitter || 0, 1);

	    // The initial enemy/target position diffs, where hdiff is the
	    // across distance
	    var xdiff, ydiff, hdiff;
	    xdiff = target.center.x - this.center.x;
	    ydiff = target.center.y - this.center.y;

	    xdiff += (R.bool() ? -1 : 1) * jitter * xdiff;
	    ydiff += (R.bool() ? -1 : 1) * jitter * ydiff;
	    hdiff = Math.sqrt(xdiff * xdiff + ydiff * ydiff);

	    // If the direct distance is less than the follow within distance,
	    // closeness
	    var closeness = within / hdiff;

	    var speed = this.speed - (closeness * this.speed);
	    // console.log("this:", this, "spd:",this.speed * 17);
	    // console.log("cl:", closeness, "this.sp", this.speed, "sp", speed);
	    // console.log("tn:", turn, "dif", penalty * turn, "sp", speed);

	    var velx, vely;
	    velx = xdiff / hdiff * speed / 17;
	    vely = ydiff / hdiff * speed / 17;

	    // if (isNaN(velx) || isNaN(vely)) {
	    //     console.log(this.center.x, target.center.x, xdiff, ydiff, hdiff, speed, this.vel.x, this.vel.y);
	    //     game.c.entities.destroy(this);
	    //     return;
	    // }
	    this.vel.x = velx;
	    this.vel.y = vely;
	};

	Sprite.moveAway = function(target, dist, strict) {

	    if (typeof dist == "undefined")
	        dist = 3;

	    // Strict flag 
	    // strict will only perform the move if the centers are within dist
	    if (typeof strict == "undefined")
	        strict = false;

	    var xdiff, ydiff, hdiff;
	    xdiff = target.center.x - this.center.x;
	    ydiff = target.center.y - this.center.y;
	    hdiff = Math.sqrt(xdiff * xdiff + ydiff * ydiff);

	    // Only occurs when entity is pressed against a wall
	    if (hdiff === 0) {
	        hdiff = 0.1 * Math.random();
	    } 

	    if (hdiff > dist && strict) {
	        return;
	    }

	    this.center.x -= xdiff / hdiff * dist;
	    this.center.y -= ydiff / hdiff * dist;
	};

	module.exports = Sprite;


/***/ },
/* 14 */
/***/ function(module, exports) {

	var Random = {};
	Random.bool =  function() {
	    return Math.random() > 0.5;
	}
	Random.any = function() {
	    return arguments[Math.floor(Math.random() * arguments.length)]
	}
	Random.scale = function(a) {
	    return Math.random() * a;
	}
	Random.point = function(xMax, yMax) {

	    xMax = xMax || 1;
	    yMax = yMax || 1;

	    return {
	        x: Random.between(0, xMax),
	        y: Random.between(0, yMax)
	    }
	}
	Random.between = function(a, b) {
	    var _a;

	    // Guarantee b > a, for comparison
	    if (a > b) {
	        _a = a;
	        a = b;
	        b = _a;
	    }

	    return Math.random() * (b - a) + a;
	}
	module.exports = Random;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Bullet = __webpack_require__(12);
	var Player = __webpack_require__(11);
	var Utils = __webpack_require__(6);
	var Wall = __webpack_require__(10);
	var Sprite = __webpack_require__(13);
	var Maths = __webpack_require__(1).Collider.Maths;
	var Geom = __webpack_require__(16);
	var DEBUG = __webpack_require__(7).DEBUG;

	var Avoider = function(game, settings) {
	    this.c = game.c;
	    this.game = game;

	    // list of bullets that collided with fake external shell
	    this.threats = [];

	    this.boundingBox = game.c.collider.CIRCLE;

	    // Extend this
	    Utils.extend(this, Sprite, ["follow", "moveAway", "drawRect", "drawFilledCircle"]);
	    Utils.extend(this, {
	        size: { x:100, y:100 },
	        color: "rgba(127, 127, 127, 0.05)",
	        vel: { x: 0, y: 0 },
	        center: settings.center
	    });

	    // Extend core
	    this.core = Utils.extend({
	        vel: this.vel
	    }, settings);
	};

	Avoider.prototype.draw = function(ctx) {
	    if (DEBUG)
	        this.drawFilledCircle(ctx);
	    this.drawFilledCircle.call(this.core, ctx);
	};
	Avoider.prototype.update = function(delta) {
	    var temp;

	    // Try to set enemy to target Player
	    if (!this.target) {
	        temp = this.c.entities.all(__webpack_require__(11));
	        if (temp.length)
	            this.target = temp[0];
	        else
	            return;
	    }

	    // VV buggy
	    this.follow.call(this.core, this.target);

	    var avel, vx, vy, vr;
	    if (false) {

	        avel = this.avoid();
	        vx = avel.x;
	        vy = avel.y;
	        vr = Math.sqrt(vx * vx + vy * vy);

	        if (!(isNaN(vx) || isNaN(vy) || isNaN(vr) || vr === 0)) {
	            // console.log("vx", vx, "vy", vy, "vr", vr);
	            // console.log("vx", vx / vr * this.speed / 17, "vy", vy / vr * this.speed / 17);
	            // console.log("nvx", this.vel.x, "nvy", this.vel.y);
	            this.vel.x = vx / vr * this.speed / 17;
	            this.vel.y = vy / vr * this.speed / 17;
	            // this.game.pauser.pause();
	        }
	    }

	    // console.log("ut:", this.center.x, this.center.y, this.vel.x, this.vel.y);
	    this.center.x += this.vel.x * delta;
	    this.center.y += this.vel.y * delta;

	    //  Clear threats array, repopulated in this.collision
	    this.threats.length = 0;
	};

	Avoider.prototype.avoid = function() {
	    // Net velocity of threats
	    var vel = { x: 0, y: 0 };
	    var self = this;
	    var moves = [];

	    this.threats.forEach(function(threat) {
	        // Intersections of bullet and core ([front, back]);
	        var bulletAndCoreFutureIntersections = Geom.intersectionsOfRayAndCircle(threat, self.core); 
	        if (bulletAndCoreFutureIntersections.length === 0)
	            return;
	        var i = bulletAndCoreFutureIntersections[0];
	        var j =
	            Geom.intersectionRayAndPerpendicularLineThroughPoint(threat,
	                    self.core.center); 
	            var rayBetweenCoreCenterAndJ = Geom.rayBetween(self.core.center, j);
	        var outerCoreIntersection =
	            Geom.intersectionsOfRayAndCircle(rayBetweenCoreCenterAndJ,
	                    self.core)[0]; 
	        var distanceToImpact = Maths.distance(i, threat.center); 
	        // console.log("distanceToImpact", distanceToImpact);
	        if (DEBUG) {
	            threat.color = "#0f0";
	            threat.draw(self.c.renderer.getCtx());
	            var p = { center: i };
	            var r = { center: j };
	            var s = { center: outerCoreIntersection };
	            // Red is on outer shell
	            p.color = "#f00";
	            Sprite.drawPoint.call(p, self.c.renderer.getCtx(), 4);
	            r.color = "#00f";
	            Sprite.drawPoint.call(r, self.c.renderer.getCtx(), 4);
	            s.color = "#0ff";
	            Sprite.drawPoint.call(s, self.c.renderer.getCtx(), 4);
	        }
	        // console.log("(j.x - outerCoreIntersection.x) * 1  / distanceToImpact", (j.x - outerCoreIntersection.x) * 1 / distanceToImpact);
	        // console.log("(j.y - outerCoreIntersection.y) * 1  / distanceToImpact", (j.y - outerCoreIntersection.y) * 1 / distanceToImpact);
	        moves.push({
	            x: (j.x - outerCoreIntersection.x) / distanceToImpact,
	            y: (j.y - outerCoreIntersection.y) / distanceToImpact,
	        });
	    });

	    var vx = 0, vy = 0;
	    moves.forEach(function(m) {
	        vx += m.x;
	        vy += m.y;
	    });

	    return {
	        x: vx,
	        y: vy,
	    };
	};

	Avoider.prototype.collision = function(other) {
	    if (other instanceof Bullet) {
	        if (Maths.pointInsideCircle(other.center, this.core)) {
	            this.game.scorer.add(5);
	            this.c.entities.destroy(this);

	            // If the core is near the player (target), don't move away from
	            // bullets, prevents bug where enemies hover around a shooting player
	        } else if (!Maths.circlesIntersecting(this, this.target)) {
	            this.moveAway.call(this, other, this.bulletAway);
	            // this.threats.push(other);
	        }
	    }

	    else if (other instanceof Player) {
	        if (Maths.circlesIntersecting(this.core, other))
	            this.c.entities.destroy(other);
	    } else if (other instanceof Wall) {
	        if (Maths.circleAndRectangleIntersecting(this.core, other))
	            other.alignPlayer(this.core);
	        // this.c.entities.destroy(this);
	    } else if (other instanceof Avoider) {
	        this.moveAway.call(this.core, other.core, this.away, true);
	    }

	};

	module.exports = Avoider;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(6);

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
	module.exports = Geometry;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var deepFreeze = __webpack_require__(6).deepFreeze;

	var Config = {
	    Player: {
	        size: {x: 20, y: 20},
	        color : "#000",
	        speed: 80 / 17, // pixels per 17ms
	        bulletDelay: 30,
	        bulletDeviation: 0.35
	    },
	    Bullet: {
	        delay: 30,
	        disorder: 0.35,
	        speed : 200 / 17,
	    }
	}

	module.exports = deepFreeze(Config);


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var Player = __webpack_require__(11);
	var Bullet = __webpack_require__(12);
	var Utils = __webpack_require__(6);
	var Wall = __webpack_require__(10);
	var Sprite = __webpack_require__(13);
	var Maths = __webpack_require__(1).Collider.Maths;

	var Micro = function(game, settings) {

	    var defaults = {
	        size: { x:5, y:5 },
	        vel: { x: 0, y: 0 },
	        color : "#fff",
	        speed : 200 / 17 // pixels per 17ms
	    }

	    this.c = game.c;
	    this.game = game;
	    Utils.extend(this, Sprite, ["follow", "moveAway", "drawRect"]);
	    Utils.extend(this, defaults);
	    Utils.extend(this, settings);

	    this.draw = this.drawRect;
	}

	Micro.prototype.update = function(delta) {
	    var temp;

	    // Try to set enemy to target Player
	    if (!this.target) {
	        temp = this.c.entities.all(__webpack_require__(11));
	        if (temp.length)
	            this.target = temp[0]
	        else
	            return
	    }

	    this.follow(this.target, {
	        within : this.within,
	        jitter : this.jitter
	    });

	    // console.log("ut:", this.center.x, this.center.y, this.vel.x, this.vel.y);
	    this.center.x += this.vel.x * delta;
	    this.center.y += this.vel.y * delta;
	};

	Micro.prototype.collision = function(other) {
	    if (other instanceof Bullet) {   
	        this.c.entities.destroy(this);
	        this.game.scorer.add(1);
	    }
	    else if (other instanceof Player)
	        this.c.entities.destroy(other)
	            // // if intersecting target, don't do change position!
	            // else if (this.target && Maths.pointInsideCircle(this, this.target))
	            //     return

	    else if (other instanceof Wall)
	        other.alignPlayer(this);
	    // this.c.entities.destroy(this);

	    else if (other instanceof Micro)
	        this.moveAway(other, this.away);


	}

	module.exports = Micro;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var Bullet = __webpack_require__(12);
	var Utils = __webpack_require__(6);
	var Wall = __webpack_require__(10);

	var Maths = __webpack_require__(1).Collider.Maths;

	var TextBox = function(game, settings) {
	    this.c = game.c;

	    Utils.assert("Settings contains coordinates (x, y)", 
	            "x" in settings && "y" in settings);
	    Utils.extend(this, settings)
	}

	TextBox.prototype.draw = function(ctx){
	    ctx.save();
	    ctx.font = this.font || '18pt Verdana';
	    ctx.fillStyle = this.color || "#000";
	    ctx.textAlign = this.align || "left";
	    ctx.fillText(this.text, this.x, this.y);
	    ctx.restore();
	};

	module.exports = TextBox;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var Base = __webpack_require__(21);
	var Global = __webpack_require__(7);
	var Player = __webpack_require__(11);
	var R = __webpack_require__(14);
	var Settings = __webpack_require__(22);
	var Simple = __webpack_require__(23);
	var TextBox = __webpack_require__(19);
	var Transition = __webpack_require__(24);
	var Timer = __webpack_require__(2);
	var Utils = __webpack_require__(6);

	var Scene = Settings.Scene;

	var PreWave = function(game) {
	    return new Transition(game, {
	        duration: 1000,
	        sceneName: "Wave 1",
	        nextScene: Wave
	    });
	};

	var Wave = function (game, settings) {
	    this.c = game.c;
	    this.game = game;
	    this.timer = new Timer();

	    this.base = Utils.bind(this, Base);
	    Utils.extend(this, Base, ["destroyExcept"]);
	};

	Wave.prototype = {};
	Wave.prototype.init = function() {
	    // define what happens at beginning

	    this.timer = new Timer();
	    var make = Utils.atMost(Scene.MAX_SIMPLE, makeSimple.bind(this));
	    make();
	    this.timer.every(Scene.spawnDelay, make); 
	    this.c.entities.create(Player, Settings.Player);
	    this.scoreBox = this.c.entities.create(TextBox, {
	        font: '30pt Verdana',
	        x: 15, y: 45, 
	        text: this.game.scorer.get(),
	    });
	};
	Wave.prototype.active = function() {
	    // Exit if key R(eset) is pressed
	    // or player is dead
	    return this.base.active();
	};
	Wave.prototype.update = function(delta) {
	    this.timer.update(delta);

	    // Update score 
	    this.scoreBox.text = this.game.scorer.get();

	    var playerAlive = this.c.entities.all(Player).length;

	    if (!playerAlive && !this.game.pauser.isPaused()) {

	        this.textBox = this.c.entities.create(TextBox, {
	            text: "Press R to restart", 
	            x: Global.Game.width / 2,
	            y: 0.4 * Global.Game.height,
	            align: "center"
	        }).draw(this.c.renderer.getCtx());

	        this.game.pauser.pause();
	    }            

	};
	Wave.prototype.exit = function() {
	    var self = this;
	    var game = this.game;
	    var destroy = this.c.entities.destroy.bind(this.c.entities);

	    this.destroyExcept(/* destroy everything */);

	    game.scorer.reset();
	    if (game.pauser.isPaused())
	        game.pauser.unpause();
	    game.scener.start(PreWave);
	};

	var makeSimple = function () {
	    var center = { x: 0, y: 0 };

	    if (R.bool()) {
	        center.x = R.bool() ? Global.Game.width : 0;
	        center.y = R.scale(Global.Game.height);
	    } else {
	        center.y = R.bool() ? Global.Game.height : 0;
	        center.x = R.scale(Global.Game.width);
	    }

	    this.c.entities.create( Simple, 
	            Utils.extend({ center: center }, Settings.Simple));

	};

	module.exports = PreWave;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require){

	    var R = __webpack_require__(14);
	    var Utils = __webpack_require__(6);
	    var Time = __webpack_require__(2);
	    var Player = __webpack_require__(11);

	    var Wave = {};

	    Wave.destroyExcept = function(exceptions) {
	        Utils.assert("destroyExcept requires scene: " + this.name + 
	                " to have a reference to the coquette game object", "c" in this);

	        exceptions = 
	            exceptions === undefined
	            ? []
	            : typeof exceptions != "array"
	            ? [ exceptions ]
	            : exceptions

	        var destroy = this.c.entities.destroy.bind(this.c.entities);
	        this.c.entities._entities.filter(function(ent){
	            // If entity isn't an exception
	            return exceptions.indexOf(ent.constructor) == -1;
	        }).forEach(destroy);
	    };

	    Wave.active = function() {
	        var I = this.c.inputter;
	        if (I.isDown(I.R))
	            return false;

	        var playerDead = this.c.entities.all(Player).length === 0;
	        if (playerDead)
	            return false

	        return true;
	    };

	    Wave.init = function() {
	        this.timer = new Timer();
	        this.c.entities.create(Player, Settings.Player);
	    };

	    Wave.exit = function() {

	        var me = this;
	        this.c.entities._entities.forEach(function(ent) {
	            if (!(ent instanceof Player)) 
	                me.c.entities.destroy(ent);
	        });
	    };

	    return Wave;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); 


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var deepFreeze = __webpack_require__(6).deepFreeze;

	var Config = {

	    Scene: {
	        MAX_SIMPLE:  30,
	        color:"#efefef",
	        spawnDelay: 100
	    },

	    // Completely namespace player and player's bullet
	    Player: {
	        Player: {},
	        Bullet: {
	            delay: 30,
	            speed: 200 / 17,
	            disorder: 0.3,
	        }
	    },

	    Avoid: {
	        // speed : 10 / 17,
	        speed : 40 / 17,

	        size: { x:20, y:20 },

	        // How far like enemies move away from each other
	        away: 12,

	        // How far enemy moves away from bullet
	        bulletAway: 5,

	        color: "#f0af0f",

	        // Enemies stay within distance from target
	        // within: 250,
	        within: 10,

	        // Enemy divergence from following player
	        jitter: 0
	    },

	    Micro: {
	        // speed : 500 / 17,
	        speed : 100 / 17,

	        // How far micro's move away from each other
	        away: 3,

	        // Micro's stay within distance from target
	        within: 50,

	        // Micro divergence from following player
	        jitter: 0.02
	    },
	    Simple: {
	        speed : 40 / 17,

	        size: {
	            x: 20,
	            y: 20,
	        },

	        // How far enemyies move away from each other
	        away: 5,

	        color: "#beb",

	        // Enemies stay within distance from target
	        // within: 250,
	        within: 10,

	        // Enemy divergence from following player
	        jitter: 0
	    },
	};

	module.exports = deepFreeze(Config);


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var Bullet = __webpack_require__(12);
	var Player = __webpack_require__(11);
	var Utils = __webpack_require__(6);
	var Wall = __webpack_require__(10);
	var Sprite = __webpack_require__(13);

	var Maths = __webpack_require__(1).Collider.Maths;

	var Simple = function(game, settings) {

	    var defaults = {
	        size: { x:15, y:15 },
	        vel: { x: 0, y: 0 },
	        angle: 0, 
	        color : "#fff",
	        speed : 200 / 17, // pixels per 17ms
	        rotation: (2 * Math.PI / 17) * 0.5
	    }

	    this.c = game.c;
	    this.game = game;
	    Utils.extend(this, Sprite, ["follow", "moveAway", "drawRect"]);
	    Utils.extend(this, defaults);
	    Utils.extend(this, settings);
	    this.draw = this.drawRect;
	}

	Simple.prototype.update = function(delta) {
	    var temp;

	    // Try to set enemy to target Player
	    if (!this.target) {
	        temp = this.c.entities.all(__webpack_require__(11));
	        if (temp.length)
	            this.target = temp[0]
	        else
	            return
	    }

	    this.follow(this.target, {
	        jitter : this.jitter,
	        within: this.within
	    });

	    // console.log("ut:", this.center.x, this.center.y, this.vel.x, this.vel.y);
	    this.center.x += this.vel.x * delta;
	    this.center.y += this.vel.y * delta;
	    this.angle += this.rotation * delta;
	};

	Simple.prototype.collision = function(other) {
	    if (other instanceof Bullet){   
	        this.c.entities.destroy(this);
	        this.game.scorer.add(1);
	    }
	    // // if intersecting target, don't do change position!
	    // else if (this.target && Maths.pointInsideCircle(this, this.target))
	    //     return

	    else if (other instanceof Player)
	        this.c.entities.destroy(other)
	    else if (other instanceof Wall)
	        other.alignPlayer(this);
	    // this.c.entities.destroy(this);

	    else if (other instanceof Simple)
	        this.moveAway(other, this.away);

	}

	module.exports = Simple;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(6);
	var Base = __webpack_require__(21);
	var TextBox = __webpack_require__(19);
	var Global = __webpack_require__(7);
	var Timer = __webpack_require__(2);

	// A transition is just a simple object which adheres to the scene interface
	// (see the scene skeleton.js). 
	var Transition = function(game, settings) {
	    Utils.assert("Transition requires a next scene", 
	            "nextScene" in settings);

	    var defaults = {
	        duration: 1000,
	        message: "blah blah"
	    }

	    Utils.extend(this, Utils.extend(defaults, settings));
	    Utils.extend(this, Base, ["destroyExcept"]);
	    this.game = game;
	    this.c = game.c;
	};

	Transition.prototype = {
	    init: function() {
	        // define what happens at beginning
	        this.c.renderer.setBackground('#000');
	        this.timer = new Timer();
	        this.c.entities.create(TextBox, {
	            text: this.sceneName, 
	            color: "#fff",
	            x: Global.Game.width / 2,
	            y: Global.Game.height / 2,
	            align: "center"
	        }).draw(this.c.renderer.getCtx());
	    },
	    active:function() {
	        // return true if scene is active
	        return this.timer.getTime() < this.duration;
	    },
	    update:function(delta) {
	        this.timer.update(delta);
	    },
	    exit: function() {
	        this.destroyExcept(/* destroy everything */);
	        this.c.renderer.setBackground(Global.Game.color);
	        this.game.scener.start(this.nextScene);
	    }
	};

	module.exports = Transition;


/***/ }
/******/ ]);