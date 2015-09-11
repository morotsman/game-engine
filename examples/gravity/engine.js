(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(factory);
  } else {
    // Browser globals.
    root.game_engine = factory();
  }
}(this, function() {/**
 * @license almond 0.3.0 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../lib/almond/almond", function(){});

define('Util',{
    throttled: function (duration, fun) {
        var lastCall;
        var lastResult;
        return function () {
            var now = new Date().getTime();
            if (!lastCall) {
                lastCall = now;
                lastResult = fun.apply(this, arguments);
            } else if ((now - lastCall) > duration) {
                lastCall = now;
                lastResult = fun.apply(this, arguments);
            }
            return lastResult;
        };
    },
    isFunction : function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    } 
});



define('OffScreenHandlerFactory',[], function () {

    function OffScreenHandlerFactory() {


        var createBouncingOffScreenHandler = function (bounce, friction) {
            return function (sprite, screenWidth, screenHeight, direction,distance, now) {
                if (direction === "down") {
                    var yPos = screenHeight - sprite.getHeight() - distance;
                    sprite.setPosition(sprite.getX(), distance===0?yPos+1:yPos);
                    sprite.setSpeedY(-sprite.getSpeedY() * bounce);
                    sprite.setSpeedX(sprite.getSpeedX() * (1 - friction));
                } else if (direction === "top") {
                    sprite.setPosition(sprite.getX(), sprite.getHeight());
                    sprite.setSpeedY(-sprite.getSpeedY() * bounce);
                    sprite.setSpeedX(sprite.getSpeedX() * (1 - friction));
                } else if (direction === "right") {
                    sprite.setPosition(screenWidth - sprite.getWidth(), sprite.getY());
                    sprite.setSpeedX(-sprite.getSpeedX() * bounce);
                } else if (direction === "left") {
                    sprite.setPosition(0, sprite.getY());
                    sprite.setSpeedX(-sprite.getSpeedX() * bounce);
                }


            };
        };

        var wrappingOffScreenHandler = function (sprite, screenWidth, screenHeight, direction,distance, now) {
            if (direction === "right") {
                sprite.setPosition(0, sprite.getY());
            } else if (direction === "left") {
                sprite.setPosition(screenWidth - sprite.getWidth(), sprite.getY());
            }
            if (direction === "down") {
                sprite.setPosition(sprite.getX(), 0);
            } else if (direction === "top") {
                sprite.setPosition(sprite.getX(), screenHeight - sprite.getHeight());
            }
        };

        var destructiveOffscreenHandler = function (sprite) {
            sprite.setDestroyed();
        };


        this.getOffScreenHandler = function (wrapper) {
            if (wrapper === "wrapping") {
                return wrappingOffScreenHandler;
            } else if (wrapper === "bouncing") {
                return createBouncingOffScreenHandler.apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (wrapper === "destructive") {
                return destructiveOffscreenHandler;
            }
        };

    }
    
    return new OffScreenHandlerFactory();

});





/**
 * An adoption of https://github.com/pgkelley4/line-segments-intersect/blob/master/js/line-segments-intersect.js
 * 
 * @author Peter Kelley
 * @author pgkelley4@gmail.com
 */

define('line-intersect',[], function () {

    function LineIntersect() {

        /**
         * Calculate the cross product of the two points.
         * 
         * @param {Object} point1 point object with x and y coordinates
         * @param {Object} point2 point object with x and y coordinates
         * 
         * @return the cross product result as a float
         */
        function crossProduct(point1, point2) {
            return point1.x * point2.y - point1.y * point2.x;
        }

        /**
         * Subtract the second point from the first.
         * 
         * @param {Object} point1 point object with x and y coordinates
         * @param {Object} point2 point object with x and y coordinates
         * 
         * @return the subtraction result as a point object
         */
        function subtractPoints(point1, point2) {
            var result = {};
            result.x = point1.x - point2.x;
            result.y = point1.y - point2.y;

            return result;
        }

        /**
         * See if the points are equal.
         *
         * @param {Object} point1 point object with x and y coordinates
         * @param {Object} point2 point object with x and y coordinates
         *
         * @return if the points are equal
         */
        function equalPoints(point1, point2) {
            return (point1.x === point2.x) && (point1.y === point2.y);
        }


        /**
         * See if two line segments intersect. This uses the 
         * vector cross product approach described below:
         * http://stackoverflow.com/a/565282/786339
         * 
         * @param {Object} p point object with x and y coordinates
         *  representing the start of the 1st line.
         * @param {Object} p2 point object with x and y coordinates
         *  representing the end of the 1st line.
         * @param {Object} q point object with x and y coordinates
         *  representing the start of the 2nd line.
         * @param {Object} q2 point object with x and y coordinates
         *  representing the end of the 2nd line.
         */
        this.getLineSegmentsIntersect = function (p, p2, q, q2) {
            var r = subtractPoints(p2, p);
            var s = subtractPoints(q2, q);

            var uNumerator = crossProduct(subtractPoints(q, p), r);
            var denominator = crossProduct(r, s);

            if (uNumerator === 0 && denominator === 0) {
                return Number.MAX_VALUE;
            }

            if (denominator === 0) {
                // lines are paralell
                return Number.MAX_VALUE;
            }

            var u = uNumerator / denominator;
            var t = crossProduct(subtractPoints(q, p), s) / denominator;

            if ((t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)) {
                return t;
            }
            return Number.MAX_VALUE;
        };



    }
    
    return new LineIntersect();

});










define('RectangularCollisionStartegy',["line-intersect"], function (lineIntersect) {

    function RectangularCollisionStartegy() {

        var minkowskiDifference = function (one, two) {
            return {
                left: one.x - two.maxX,
                top: one.y - two.maxY,
                width: one.width + two.width,
                height: one.height + two.height
            };
        };
        var detectSide = function (md) {
            var direction = "left";
            var minDist = Math.abs(md.left);
            if (Math.abs(md.left + md.width) < minDist)//a cornercase here: the minDistance could be equal if something that has the width of one pixel hits a corner. 
            {
                minDist = Math.abs(md.left + md.width);
                direction = "right";
            }
            if (Math.abs(md.top + md.height) < minDist)
            {
                minDist = Math.abs(md.top + md.height);
                direction = "down";
            }
            if (Math.abs(md.top) < minDist)
            {
                direction = "top";
            }
            return direction;
        };


        var getIntersectionFraction = function (md, relativeSpeed) {
            var origin = {
                x: 0,
                y: 0
            };
            var endPoint = relativeSpeed;

            var minY = md.top;
            var maxY = md.top + md.height;
            var minX = md.left;
            var maxX = md.left + md.width;

            // for each of the AABB's four edges
            // calculate the minimum fraction of "direction"
            // in order to find where the ray FIRST intersects
            // the AABB (if it ever does)   
            var minT = lineIntersect.getLineSegmentsIntersect(origin, endPoint, {x: minX, y: minY}, {x: minX, y: maxY});//topLeft to bottomLeft
            var x;
            x = lineIntersect.getLineSegmentsIntersect(origin, endPoint, {x: minX, y: maxY}, {x: maxX, y: maxY});//bottomLeft to bottomRight
            if (x < minT)
                minT = x;
            x = lineIntersect.getLineSegmentsIntersect(origin, endPoint, {x: maxX, y: maxY}, {x: maxX, y: minY});//bottomRight to topRight
            if (x < minT)
                minT = x;
            x = lineIntersect.getLineSegmentsIntersect(origin, endPoint, {x: maxX, y: minY}, {x: minX, y: minY});//topRight to topLeft
            if (x < minT)
                minT = x;
            // ok, now we should have found the fractional component along the ray where we collided
            return minT;
        };

        var spriteToAABB = function (sprite) {
            return {
                x: sprite.getX(),
                y: sprite.getY(),
                maxX: sprite.getX() + sprite.getWidth(),
                maxY: sprite.getY() + sprite.getHeight(),
                width: sprite.getWidth(),
                height: sprite.getHeight()
            };
        };

        var relativeSpeed = function (one, two) {
            var relativeX = one.getSpeedX() - two.getSpeedX();
            var relativeY = one.getSpeedY() - two.getSpeedY();
            return {
                x: -relativeX,
                y: relativeY
            };
        };

        this.collision = function (sprite1, sprite2) {
            var one = spriteToAABB(sprite1);
            var two = spriteToAABB(sprite2);
            var md = minkowskiDifference(one, two);
            if (md.left <= 0 && md.left + md.width >= 0
                    && md.top <= 0 && md.top + md.height >= 0) {
                return detectSide(md);
            } else {
                var rSpeed = relativeSpeed(sprite1, sprite2);
                var h = getIntersectionFraction(md, rSpeed);
                if (h !== Number.MAX_VALUE) {
                    one.x = one.x + sprite1.getSpeedX() * h;
                    one.maxX = one.x + one.width;
                    one.y = one.y - sprite1.getSpeedY() * h;
                    one.maxY = one.y + one.height;
                    two.x = two.x + sprite2.getSpeedX() * h;
                    two.maxX = two.x + two.width;
                    two.y = two.y - sprite2.getSpeedY() * h;
                    two.maxY = two.y + two.height;
                    var md = minkowskiDifference(one, two);
                    var hepp1 = one;
                    var hepp2 = two;
                    if (md.left <= 0 && md.left + md.width >= 0
                            && md.top <= 0 && md.top + md.height >= 0) {
                        return detectSide(md);
                    }
                }



            }


        };
    };

    return new RectangularCollisionStartegy();
});





define('renderer/CanvasRenderer',[], function () {


    function CanvasRenderer(canvasId) {
        var canvas = document.getElementById(canvasId);
        var context = canvas.getContext("2d");


        this.height = function () {
            return canvas.height;
        };

        this.width = function () {
            return canvas.width;
        };

        this.clearRect = function () {
            context.clearRect.apply(context, arguments);
        };

        this.save = function () {
            context.save.apply(context, arguments);
        };

        this.restore = function () {
            context.restore.apply(context, arguments);
        };

        this.drawImage = function (sprite) {
            if (!sprite.getSpritesPerRow()) {
                context.drawImage(sprite.getImage(), sprite.getX(), sprite.getY(), sprite.getWidth(), sprite.getHeight());
            } else {
                var row = Math.floor(sprite.getCurrentFrameNumber() / sprite.getSpritesPerRow());
                var sx = sprite.getSpriteX() + sprite.getSpriteWidth() * (sprite.getCurrentFrameNumber() - (row * sprite.getSpritesPerRow()));
                var sy = sprite.getSpriteY() + sprite.getSpriteHeight() * row;
                context.drawImage(sprite.getImage(), sx, sy, sprite.getSpriteWidth(), sprite.getSpriteHeight(), sprite.getX(), sprite.getY(), sprite.getWidth(), sprite.getHeight());
            }

        };

        this.flush = function () {
        }
    }
    ;



    return CanvasRenderer;

});






define('renderer/webgl/WebGLUtil',[], function () {

    function Util() {
        var that = this;

        this.initGL = function (canvas) {
            var gl;
            try {
                gl = canvas.getContext("webgl");
                gl.viewportWidth = canvas.width;
                gl.viewportHeight = canvas.height;
            } catch (e) {
            }
            if (!gl) {
                alert("Could not initialise WebGL, sorry :-(");
            } else {
                return gl;
            }

        };

        this.setupShader = function (gl, type, source) {
            var shader;
            if (type === "fragment") {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else if (type === "vertex") {
                shader = gl.createShader(gl.VERTEX_SHADER);
            } else {
                return null;
            }

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        };



        this.getShaderUniforms = function (gl, program, uniforms) {
            var result = {};
            uniforms.forEach(function (uniform) {
                result[uniform] = gl.getUniformLocation(program, uniform);
            });
            return result;
        };

        this.getShaderAttributes = function (gl, program, attributes) {
            var result = {};
            attributes.forEach(function (attribute) {
                result[attribute] = gl.getAttribLocation(program, attribute);
            });
            return result;
        };

        this.createTextureFromImage = function (gl, image) {
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.bindTexture(gl.TEXTURE_2D, null);
            return texture;
        };

    }
    ;
    
    return new Util();

});





define('renderer/webgl/WEbGLUtil',[], function () {

    function Util() {
        var that = this;

        this.initGL = function (canvas) {
            var gl;
            try {
                gl = canvas.getContext("webgl");
                gl.viewportWidth = canvas.width;
                gl.viewportHeight = canvas.height;
            } catch (e) {
            }
            if (!gl) {
                alert("Could not initialise WebGL, sorry :-(");
            } else {
                return gl;
            }

        };

        this.setupShader = function (gl, type, source) {
            var shader;
            if (type === "fragment") {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else if (type === "vertex") {
                shader = gl.createShader(gl.VERTEX_SHADER);
            } else {
                return null;
            }

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        };



        this.getShaderUniforms = function (gl, program, uniforms) {
            var result = {};
            uniforms.forEach(function (uniform) {
                result[uniform] = gl.getUniformLocation(program, uniform);
            });
            return result;
        };

        this.getShaderAttributes = function (gl, program, attributes) {
            var result = {};
            attributes.forEach(function (attribute) {
                result[attribute] = gl.getAttribLocation(program, attribute);
            });
            return result;
        };

        this.createTextureFromImage = function (gl, image) {
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.bindTexture(gl.TEXTURE_2D, null);
            return texture;
        };

    }
    ;
    
    return new Util();

});





define('renderer/webgl/ImageRenderer',["renderer/webgl/WEbGLUtil"], function (util) {

    var vertexShader = [
        'attribute vec2 a_position;',
        'varying vec2 v_texCoord;', 
        'uniform float spritesPerRow;',
        'uniform vec2 spriteTextureSize;',
        'uniform vec2 spriteSize;',
        'uniform vec2 spriteStartPos;',
        'uniform vec4 u_screenDims;',
        'attribute float rotation;',
        'attribute vec2 centerPosition;',
        'attribute float currentFrameNumber;',
        'attribute vec2 scale;',
        'void main() {',
        '   float row = floor(currentFrameNumber / spritesPerRow);',
        '   vec2 upperLeftTC = spriteStartPos + vec2(spriteTextureSize.x * (currentFrameNumber - (row * spritesPerRow)),spriteTextureSize.y * row);',
        '   vec2 tc = upperLeftTC + spriteTextureSize * a_position;',
        '   v_texCoord = tc;',
        '   float s = sin(rotation);',
        '   float c = cos(rotation);',
        '   mat2 rotMat = mat2(c, -s, s, c);',
        '   vec2 scaledOffset = spriteSize * a_position*scale;',
        '   vec2 pos = centerPosition + rotMat * scaledOffset;',
        '   gl_Position = vec4(pos * u_screenDims.xy + u_screenDims.zw, 0.0, 1.0); ',
        '}'
    ].join('\n');
    var fragmentShader = [
        "precision mediump float;",
        "uniform sampler2D u_image;",
        "varying vec2 v_texCoord;",
        "void main() {",
        "   gl_FragColor = texture2D(u_image, v_texCoord);",
        "}"
    ].join('\n');

    var shaderProgram
    var gl;
    var canvas;
    var parameterLocations = {};
    var buffers = {};
    var spriteCache = {};
    var imageCache = {};

    var MAX_BATCH = 5000;

    var init = function (fragmentShader, vertexShader) {
        //create program
        var fragmentShader = util.setupShader(gl, "fragment", fragmentShader);
        var vertexShader = util.setupShader(gl, "vertex", vertexShader);
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.bindAttribLocation(shaderProgram, 0, "a_position");
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
        gl.useProgram(shaderProgram);

        //setup uniforms and attributes
        parameterLocations.positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
        parameterLocations.currentFrameNumber = gl.getAttribLocation(shaderProgram, "currentFrameNumber");
        parameterLocations.spritesPerRow = gl.getUniformLocation(shaderProgram, "spritesPerRow");
        parameterLocations.spriteTextureSize = gl.getUniformLocation(shaderProgram, "spriteTextureSize");
        parameterLocations.spriteSize = gl.getUniformLocation(shaderProgram, "spriteSize");
        parameterLocations.screenDimsLoc = gl.getUniformLocation(shaderProgram, "u_screenDims");
        parameterLocations.spriteStartPos = gl.getUniformLocation(shaderProgram, "spriteStartPos");
        parameterLocations.rotation = gl.getAttribLocation(shaderProgram, "rotation");
        parameterLocations.centerPosition = gl.getAttribLocation(shaderProgram, "centerPosition");
        parameterLocations.scale = gl.getAttribLocation(shaderProgram, "scale");



        // set the resolution
        gl.uniform2f(parameterLocations.resolutionLocation, canvas.width, canvas.height);

        // Create a buffer for the position of the rectangle corners.
        buffers.rectangle = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rectangle);
        gl.enableVertexAttribArray(parameterLocations.positionLocation);
        gl.vertexAttribPointer(parameterLocations.positionLocation, 2, gl.FLOAT, false, 0, 0);

        buffers.scale = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.scale);
        gl.enableVertexAttribArray(parameterLocations.scale);
        gl.vertexAttribPointer(parameterLocations.scale, 2, gl.FLOAT, false, 0, 0);

        buffers.centerPosition = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.centerPosition);
        gl.enableVertexAttribArray(parameterLocations.centerPosition);
        gl.vertexAttribPointer(parameterLocations.centerPosition, 2, gl.FLOAT, false, 0, 0);

        buffers.currentFrameNumber = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.currentFrameNumber);
        gl.enableVertexAttribArray(parameterLocations.currentFrameNumber);
        gl.vertexAttribPointer(parameterLocations.currentFrameNumber, 2, gl.FLOAT, false, 0, 0);

        buffers.rotation = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rotation);
        gl.enableVertexAttribArray(parameterLocations.rotation);
        gl.vertexAttribPointer(parameterLocations.rotation, 2, gl.FLOAT, false, 0, 0);

        gl.clearColor(0.0, 0.0, 0.0, 0);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
    };



    function ImageRenderer() {

        this.init = function (_gl, _canvas) {
            gl = _gl;
            canvas = _canvas;
            init(fragmentShader, vertexShader);
        };
        
        
        this.drawImage = function (sprite) {
            var currentImageSrc = sprite.getImage().currentSrc;
            if (!imageCache[currentImageSrc]) {
                imageCache[currentImageSrc] = {};
                imageCache[currentImageSrc].texture = util.createTextureFromImage(gl, sprite.getImage());
                imageCache[currentImageSrc].spritesPerRow = sprite.getSpritesPerRow() ? sprite.getSpritesPerRow() : 1;
                imageCache[currentImageSrc].imageWidth = sprite.getImage().width;
                imageCache[currentImageSrc].imageHeight = sprite.getImage().height;
                imageCache[currentImageSrc].spriteWidth = sprite.getSpriteWidth() ? sprite.getSpriteWidth() : sprite.getImage().width;
                imageCache[currentImageSrc].spriteHeight = sprite.getSpriteHeight() ? sprite.getSpriteHeight() : sprite.getImage().height;
                imageCache[currentImageSrc].spriteX = sprite.getSpriteX();
                imageCache[currentImageSrc].spriteY = sprite.getSpriteY();
                spriteCache[currentImageSrc] = [];
            }
            spriteCache[currentImageSrc].push(sprite);            
            /*
            spriteCache[currentImageSrc].push({
                x: sprite.getX(),
                y: sprite.getY(),
                scaleX: sprite.getWidth() / imageCache[currentImageSrc].spriteWidth,
                scaleY: sprite.getHeight() / imageCache[currentImageSrc].spriteHeight,
                rotation: 0,
                currentFrameNumber: sprite.getCurrentFrameNumber()
            });
            */
        };        



        function createRectangles(limit) {
            var result = new Float32Array(limit * 12);
            var prevSize;
            
            var rectangles = function (gl, sprites) {
                var offset;
                for (var i = 0; i < sprites.length; i++) {
                    offset = 12 * i;
                    result[offset] = 0;
                    result[offset + 1] = 0;
                    result[offset + 2] = 0;
                    result[offset + 3] = 1;
                    result[offset + 4] = 1;
                    result[offset + 5] = 0;
                    result[offset + 6] = 1;
                    result[offset + 7] = 0;
                    result[offset + 8] = 0;
                    result[offset + 9] = 1;
                    result[offset + 10] = 1;
                    result[offset + 11] = 1;
                }

                if (prevSize > sprites.length) {
                    for (var i = sprites.length; i < prevSize; i++) {
                        offset = 12 * i;
                        result[offset] = 0;
                        result[offset + 1] = 0;
                        result[offset + 2] = 0;
                        result[offset + 3] = 0;
                        result[offset + 4] = 0;
                        result[offset + 5] = 0;
                        result[offset + 6] = 0;
                        result[offset + 7] = 0;
                        result[offset + 8] = 0;
                        result[offset + 9] = 0;
                        result[offset + 10] = 0;
                        result[offset + 11] = 0;
                    }
                }
                prevSize = sprites.length;
                return result;
            };
            
            return rectangles;
        };



        function createScales(limit) {
            var result = new Float32Array(limit * 12);
            
            var scales = function (sprites, startIndex, stopIndex) {
                for (var i = startIndex; i < stopIndex; i++) {
                    var scaleX = sprites[i].getWidth() / imageCache[sprites[i].getImage().currentSrc].spriteWidth;
                    var scaleY = sprites[i].getHeight() / imageCache[sprites[i].getImage().currentSrc].spriteHeight;
                    var offset = 12 * i;
                    result[offset] = scaleX;
                    result[offset + 1] = scaleY;
                    result[offset + 2] = scaleX;
                    result[offset + 3] = scaleY;
                    result[offset + 4] = scaleX;
                    result[offset + 5] = scaleY;
                    result[offset + 6] = scaleX;
                    result[offset + 7] = scaleY;
                    result[offset + 8] = scaleX;
                    result[offset + 9] = scaleY;
                    result[offset + 10] = scaleX;
                    result[offset + 11] = scaleY;
                }
                return result;
            };
            
            
            return scales;
        }
        ;

        function createCenterPositions(limit) {
            var result = new Float32Array(limit * 12);
            
            var centerPositions = function (sprites, startIndex, stopIndex) {
                var index = 0;
                for (var i = startIndex; i < stopIndex; i++) {
                    var offset = 12 * index;
                    result[offset] = sprites[i].getX();
                    result[offset + 1] = sprites[i].getY();
                    result[offset + 2] = sprites[i].getX();
                    result[offset + 3] = sprites[i].getY();
                    result[offset + 4] = sprites[i].getX();
                    result[offset + 5] = sprites[i].getY();
                    result[offset + 6] = sprites[i].getX();
                    result[offset + 7] = sprites[i].getY();
                    result[offset + 8] = sprites[i].getX();
                    result[offset + 9] = sprites[i].getY();
                    result[offset + 10] = sprites[i].getX();
                    result[offset + 11] = sprites[i].getY();
                    index++;
                }
                return result;
            };
            
            return centerPositions;
        };

        function createCurrentFrameNumber(limit) {
            var result = new Float32Array(limit * 12);
            
            var currentFrameNumber = function (sprites, image, startIndex, stopIndex) {
                var index = 0;
                for (var i = startIndex; i < stopIndex; i++) {
                    var offset = 12 * index;
                    result[offset] = sprites[i].getCurrentFrameNumber();
                    result[offset + 1] = sprites[i].getCurrentFrameNumber();
                    result[offset + 2] = sprites[i].getCurrentFrameNumber();
                    result[offset + 3] = sprites[i].getCurrentFrameNumber();
                    result[offset + 4] = sprites[i].getCurrentFrameNumber();
                    result[offset + 5] = sprites[i].getCurrentFrameNumber();
                    result[offset + 6] = sprites[i].getCurrentFrameNumber();
                    result[offset + 7] = sprites[i].getCurrentFrameNumber();
                    result[offset + 8] = sprites[i].getCurrentFrameNumber();
                    result[offset + 9] = sprites[i].getCurrentFrameNumber();
                    result[offset + 10] = sprites[i].getCurrentFrameNumber();
                    result[offset + 11] = sprites[i].getCurrentFrameNumber();
                    index++;
                }


                return result;
            };
            
            return currentFrameNumber;
        };

        function createRotation(limit) {
            var result = new Float32Array(limit * 12);
            
            var rotation = function (sprites, startIndex, stopIndex) {
                var index = 0;
                for (var i = startIndex; i < stopIndex; i++) {
                    var offset = 12 * index;
                    result[offset] = sprites[i].getRotation();
                    result[offset + 1] = sprites[i].getRotation();
                    result[offset + 2] = sprites[i].getRotation();
                    result[offset + 3] = sprites[i].getRotation();
                    result[offset + 4] = sprites[i].getRotation();
                    result[offset + 5] = sprites[i].getRotation();
                    result[offset + 6] = sprites[i].getRotation();
                    result[offset + 7] = sprites[i].getRotation();
                    result[offset + 8] = sprites[i].getRotation();
                    result[offset + 9] = sprites[i].getRotation();
                    result[offset + 10] = sprites[i].getRotation();
                    result[offset + 11] = sprites[i].getRotation();
                    index++;
                }
                return result;
            };
            
            return rotation;
        };

        var rectangleCreator = createRectangles(MAX_BATCH);
        var scaleCreator = createScales(MAX_BATCH);
        var centerPositionCreator = createCenterPositions(MAX_BATCH);
        var currentFrameNumberCreator = createCurrentFrameNumber(MAX_BATCH);
        var rotationCreator = createRotation(MAX_BATCH);


        this.flush = function () {

            gl.uniform4f(parameterLocations.screenDimsLoc,
                    2.0 / canvas.width,
                    -2.0 / canvas.height,
                    -1.0,
                    1.0);


            for (var property in imageCache) {
                if (imageCache.hasOwnProperty(property)) {
                    var image = imageCache[property];
                    gl.uniform1f(parameterLocations.spritesPerRow, image.spritesPerRow);
                    gl.uniform2f(parameterLocations.spriteTextureSize, image.spriteWidth / image.imageWidth, image.spriteHeight / image.imageHeight);
                    gl.uniform2f(parameterLocations.spriteSize, image.spriteWidth, image.spriteHeight);
                    gl.uniform2f(parameterLocations.spriteStartPos,image.spriteX / image.imageWidth,image.spriteY / image.imageHeight);
                    var spritesToDraw = spriteCache[property];
                    gl.bindTexture(gl.TEXTURE_2D, image.texture);

                    var startIndex = 0;
                    var stopIndex = MAX_BATCH < spritesToDraw.length ? MAX_BATCH : spritesToDraw.length;
                    var hasMore = true;
                    while (hasMore) {


                        var rectangles = rectangleCreator(gl, spritesToDraw);
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rectangle);
                        gl.bufferData(gl.ARRAY_BUFFER, rectangles, gl.STATIC_DRAW);

                        var scales = scaleCreator(spritesToDraw, startIndex, stopIndex);
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.scale);
                        gl.bufferData(gl.ARRAY_BUFFER, scales, gl.STATIC_DRAW);

                        var centerPositions = centerPositionCreator(spritesToDraw, startIndex, stopIndex);
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.centerPosition);
                        gl.bufferData(gl.ARRAY_BUFFER, centerPositions, gl.STATIC_DRAW);

                        var currentFrameNumbers = currentFrameNumberCreator(spritesToDraw, image, startIndex, stopIndex);
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.currentFrameNumber);
                        gl.bufferData(gl.ARRAY_BUFFER, currentFrameNumbers, gl.STATIC_DRAW);

                        var rotation = rotationCreator(spritesToDraw, startIndex, stopIndex);
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rotation);
                        gl.bufferData(gl.ARRAY_BUFFER, rotation, gl.STATIC_DRAW);

                        gl.drawArrays(gl.TRIANGLES, 0, MAX_BATCH * 6);

                        startIndex = stopIndex;
                        stopIndex = stopIndex + MAX_BATCH;
                        if (stopIndex > spritesToDraw.length) {
                            stopIndex = spritesToDraw.length;
                        }
                        if (startIndex >= spritesToDraw.length) {
                            hasMore = false;
                        }
                    }



                }


            }

            for (var property in spriteCache) {
                if (spriteCache.hasOwnProperty(property)) {
                    spriteCache[property] = [];
                }
            }

        };

    }



    return new ImageRenderer();


});



define('renderer/webgl/WebGLRenderer',["renderer/webgl/WebGLUtil","renderer/webgl/ImageRenderer"], function (webGLUtil,imageRenderer) {



    function WebGLRenderer(canvasId) {
        var canvas = document.getElementById(canvasId);
        var gl = webGLUtil.initGL(canvas);
        if (!gl) {
            return;
        }
        
        imageRenderer.init(gl,canvas);
        
        

        this.height = function () {
            return canvas.height;
        };

        this.width = function () {
            return canvas.width;
        };

        this.clearRect = function () {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        };

        this.save = function () {

        };

        this.restore = function () {

        };

        this.drawImage = function () {
            imageRenderer.drawImage.apply(imageRenderer, arguments);         
        };
        
        
        this.flush = function () {
            imageRenderer.flush();
        };
    }
    ;



    return WebGLRenderer;

});









define('renderer/Renderer',["renderer/CanvasRenderer","renderer/webgl/WebGLRenderer"], function (CanvasRenderer,WebGLRenderer) {


    function Renderer(canvasId, type) {
        if(type === "canvas"){
            return new CanvasRenderer(canvasId);
        }else if(type === "webGL"){
            return new WebGLRenderer(canvasId);
        }else{
            return undefined;
        }
    };

    return Renderer;


    

});



define('Engine',["Util", "OffScreenHandlerFactory", "RectangularCollisionStartegy", "renderer/Renderer"], function (util, offScreenHandlerFactory, collisionStrategy, Renderer) {

    function Engine(canvasId, type) {

        var requestId;
        var updateHandler;
        var sprites = [];
        var useCollisionDetector = false;
        var that = this;
        var globalOffScreenHandler;
        var renderer = new Renderer(canvasId, type);


        this.addSprite = function (sprite) {
            sprites.push(sprite);
        };

        this.addSprites = function (_sprites) {
            sprites = sprites.concat(_sprites);
        };

        var collisionHandler = function () {

        };

        var destructionHandler = function (sprite) {

        };

        var createBufferedOffScreenDetector = function () {
            return function (screenWidth, screenHeight, sprite, now) {
                var width = sprite.getWidth();
                var height = sprite.getHeight();
                if (sprite.getX() < 0) {
                    return {
                        direction: "left",
                        distance: sprite.getX()
                    };
                } else if (sprite.getX() > (screenWidth - width)) {
                    return {
                        direction: "right",
                        distance: sprite.getX() - (screenWidth - width)
                    };
                } else if (sprite.getY() < 0) {
                    return {
                        direction: "top",
                        distance: sprite.getY()
                    };
                } else if (sprite.getY() >= (screenHeight - height)) {
                    return {
                        direction: "down",
                        distance: sprite.getY() - (screenHeight - height)
                    };
                }
                return undefined;
            };
        };

        var offScreenDetector = createBufferedOffScreenDetector(0, 0);

        var keyEvents = {};
        document.addEventListener("keydown", function (e) {
            keyEvents[e.keyCode] = e;
        }, true);

        document.addEventListener("keyup", function (e) {
            delete keyEvents[e.keyCode];
        }, true);

        this.withUpdateHandler = function (fun) {
            updateHandler = fun;
            return this;
        };

        this.withCollisionHandler = function (fun) {
            collisionHandler = fun;
            return this;
        };

        this.withDestructionHandler = function (fun) {
            destructionHandler = fun;
            return this;
        };

        this.withCollisionDetector = function () {
            useCollisionDetector = true;
            return this;
        };

        this.withGlobalOffScreenHandler = function (something) {
            if (util.isFunction(something)) {
                globalOffScreenHandler = something;
            } else {
                globalOffScreenHandler = offScreenHandlerFactory.getOffScreenHandler.apply(this, arguments);
            }
            return this;
        };

        var createFrameCounter = function () {
            var time;
            var counter = 0;
            return function (now) {
                counter++;
                if (!time) {
                    time = now;
                }
                if (now - time > 1000) {
                    if(counter < 59){
                        console.log("frame rate: " + counter);
                    }
                    counter = 0;
                    time = now;
                }
            };
        };

        var frameCounter = createFrameCounter();
        var runner = function (now) {
            requestId = requestAnimationFrame(runner);
            frameCounter(now);

            var screenWidth = renderer.width();
            var screenHeight = renderer.height();
            renderer.clearRect(0, 0, screenWidth, screenHeight);

            if (useCollisionDetector) {
                that.detectCollisions(now);
                for (var i = 0; i < sprites.length; i++) {
                    var sprite = sprites[i];
                    if (sprite.isDestroyed(now)) {
                        sprite.handleDestruction(now);
                        destructionHandler(sprite, now);
                    }
                }
            }

            if (updateHandler) {
                updateHandler(now, keyEvents);
            }

            for (var i = 0; i < sprites.length; i++) {
                var sprite = sprites[i];
                sprite.handleKeyEvents(keyEvents, now);
                sprite.handleUpdate(now);
                sprite.tick();

                var width = sprite.getWidth();
                var height = sprite.getHeight();
                var direction = undefined;
                var distance = undefined;
                if (sprite.getX() < 0) {
                    direction = "left";
                    distance = sprite.getX();
                } else if (sprite.getX() > (screenWidth - width)) {
                    direction = "right";
                    distance = sprite.getX() - (screenWidth - width);
                } else if (sprite.getY() < 0) {
                    direction = "top";
                    distance = sprite.getY();
                } else if (sprite.getY() >= (screenHeight - height)) {
                    direction = "down";
                    distance = sprite.getY() - (screenHeight - height);
                }



                if (direction) {
                    var handled = sprite.handleOffScreen(screenWidth, screenHeight, direction, distance, now);
                    if (!handled && globalOffScreenHandler) {
                        globalOffScreenHandler(sprite, screenWidth, screenHeight, direction, distance, now);
                    }
                }
            }



            var filteredSprites = [];
            for (var i = 0; i < sprites.length; i++) {
                if (!sprites[i].isDestroyed(now)) {
                    filteredSprites.push(sprites[i]);
                }
            }


            for (var i = 0; i < filteredSprites.length; i++) {
                filteredSprites[i].draw(renderer);
            }


            renderer.flush();
            sprites = filteredSprites;


        };

        this.start = function () {


            requestId = requestAnimationFrame(runner);
        };

        var opositDirection = function (side) {
            if (side === "top") {
                return "down";
            } else if (side === "down") {
                return "top";
            } else if (side === "right") {
                return "left";
            } else if (side === "left") {
                return "right";
            }
            return side;
        };

        this.detectCollisions = function () {
            for (var i1 = 0; i1 < sprites.length; i1++) {
                for (var i2 = i1 + 1; i2 < sprites.length; i2++) {
                    var direction = collisionStrategy.collision(sprites[i1], sprites[i2]);
                    if (direction && i1 !== i2) {
                        sprites[i1].handleCollision(sprites[i2], direction);
                        sprites[i2].handleCollision(sprites[i1], opositDirection(direction));
                        collisionHandler(sprites[i1], sprites[i2]);
                    }
                }
            }
        };



        this.forEach = function (fun) {
            for (var i = 0; i < sprites.length; i++) {
                fun(sprites[i]);
            }
        };


    }

    return Engine;

});







define('Sprite',["OffScreenHandlerFactory","Util"], function (offScreenHandlerFactory,util) {

    function Sprite(engine) {

        var image;
        var x = 0;
        var y = 0;
        var width = 0;
        var height = 0;
        var speedX = 0;
        var speedY = 0;
        var radius = 0;
        var animation;
        var angle;
        var destroyed = false;

        var that = this;
        var offScreenHandler;

        var keyEvents = {};
        
        var numberOfFrames;
        var spritesPerRow; 
        var spriteWidth;
        var spriteHeight;
        var currentFrameNumber = 0;
        var animationSpeed = 0;
        var animationCycle = 0;
        var rotation = 0;
        var spriteX = 0;
        var spriteY = 0;

        this.getRotation = function(){
            return rotation;
        };

        this.getSpritesPerRow = function(){
            return spritesPerRow;
        };
        
        this.getSpriteWidth = function(){
            return spriteWidth;
        };
        
        this.getSpriteHeight = function(){
            return spriteHeight;
        };
        
        this.getCurrentFrameNumber = function(){
            return currentFrameNumber;
        };
        
        this.getImage = function(){
            return image;
        };
        
        this.getX = function(){
            return x;
        };
        
        this.getY = function(){
            return y;
        };
        
        this.getWidth = function(){
            return width;
        };
        
        this.getHeight = function(){
            return height;
        };

        this.getSpriteX = function(){
            return spriteX;
        };
        
        this.getSpriteY = function(){
            return spriteY;
        };        

        this.setImage = function (_image, _numberOfFrames, _spritesPerRow, _spriteWidth, _spriteHeight,_animationSpeed, _spriteX, _spriteY) {
            image = document.getElementById(_image);
            numberOfFrames = _numberOfFrames?_numberOfFrames:1;
            spritesPerRow = _spritesPerRow;
            spriteWidth = _spriteWidth;
            spriteHeight = _spriteHeight;
            animationSpeed = _animationSpeed;
            spriteX = _spriteX?_spriteX:0;
            spriteY = _spriteY?_spriteY:0;
            return this;
        };



        this.setPosition = function (_x, _y) {
            x = _x;
            y = _y;
            return this;
        };
        
        this.increaseSpeedX = function (amount) {
            speedX = speedX + amount;
            return this;
        };

        this.increaseSpeedY = function (amount) {
            speedY = speedY + amount;
            return this;
        };

        this.setSpeedX = function (_speedX) {
            speedX = _speedX;
            return this;
        };

        this.setSpeedY = function (_speedY) {
            speedY = _speedY;
            return this;
        };

        this.getSpeedX = function () {
            return speedX;
        };

        this.getSpeedY = function () {
            return speedY;
        };

        this.setWidthAndHeight = function (_width, _height) {
            width = _width;
            height = _height;
            radius = width > height ? width / 2 : height / 2;
            return this;
        };
        

        this.setAngle = function (_angle) {
            angle = _angle;
            return this;
        };


        this.addForceVector = function (_angle, force) {
            speedX = speedX + Math.cos(_angle * Math.PI / 180) * force;
            speedY = speedY + Math.sin(_angle * Math.PI / 180) * force;
        };

        var calulateForce = function (speedX, speedY) {
            return Math.sqrt(Math.pow(speedX, 2) + Math.pow(speedY, 2));
        };
        var calculateAngle = function (speedX, speedY) {
            var angle = Math.atan2(speedY, speedX) * 180 / Math.PI;
            if (angle < 0) {
                angle = 360 + angle;
            }
            return angle;
        };

        this.relativeForceForce = function (other) {
            var relativeX = speedX - other.getSpeedX();
            var relativeY = speedY - other.getSpeedY();
            return calulateForce(relativeX, relativeY);
        };
        
        this.relativeForceAngle = function (other) {
            var relativeX = speedX - other.getSpeedX();
            var relativeY = speedY - other.getSpeedY();
            return calculateAngle(relativeX, relativeY);
        };        

        this.relativeSpeedX = function (other) {
            var relativeX = speedX - other.getSpeedX();
            return -relativeX;
        };
        
        this.relativeSpeedY = function (other) {
            var relativeY = speedY - other.getSpeedY();
            return relativeY;
        };        

        this.getForceVectorForce = function () {
            return calulateForce(speedX, speedY);
        };
        
        this.getForceVectorAngle = function () {
            return calculateAngle(speedX, speedY);
        };        

        this.getRadius = function () {
            return radius;
        };

        this.handleUpdate = function () {

        };

        this.handleCollision = function (other) {

        };

        this.handleKeyEvents = function (keyEvents) {

        };

        this.handleDestruction = function () {
            //console.log("handle destruction");
        };

        this.isDestroyed = function () {
            return destroyed;
        };

        this.setDestroyed = function () {
            destroyed = true;
        };


        this.getAngleAndDistance = function (other) {
            var distanceX = other.getX() - x;
            var distanceY = other.getY() - y;
            var angle = Math.atan2(distanceY, distanceX) * 180 / Math.PI;

            if (angle > 0) {
                angle = 360 - angle;
            } else {
                angle = -angle;
            }

            var distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

            return {
                angle: angle,
                distance: distance

            };
        };

        var prevDraw;
        var drawImage = function (context) {
            if (!image) {
                return;
            }

            context.drawImage(that);
           
            var now = new Date().getTime();
            if(!prevDraw || (now-prevDraw)>animationSpeed){
                currentFrameNumber++;
                prevDraw = now;
            }
            
            if(currentFrameNumber >= numberOfFrames){
               currentFrameNumber=0; 
               animationCycle++;
            }
        };
        
        this.getAnimationCycle = function(){
            return animationCycle;
        };

        var animate = function (context) {
            animation.setPosition(x, y);
            animation.setWidthAndHeight(width, height);
            return animation.animate(context);
        };
        
        this.tick = function(){
            x = x + speedX;
            y = y - speedY;           
        };

        this.draw = function (context) {
            context.save();
            if (animation) {
                animate(context);
            } else {
                drawImage(context);
            }
            context.restore();
        };

        this.animationCompleted = function () {
            return animation.isCompleted();
        };


        this.handleOffScreen = function (screenWidth, screenHeight, direction, now) {
            if (offScreenHandler) {
                offScreenHandler(that, screenWidth, screenHeight, direction, now);
                return true;
            }
            return false;
        };

        this.withOffScreenHandler = function (something) {
            if (util.isFunction(something)) {
                offScreenHandler = something;
            } else {
                offScreenHandler = offScreenHandlerFactory.getOffScreenHandler.apply(this, arguments);
            }
            return this;
        };

        engine.addSprite(this);

    }
    ;
    
    return Sprite;


});







define('game_engine',["Engine", "Sprite", "Util"], function(Engine, Sprite, util) {


    return {
        engine: Engine,
        sprite: Sprite,
        util: util
    };

});
//the configuration for require
requirejs.config({
    "baseUrl": "src",//the root path to use for all module lookups
});

//Main application logic 
require(["game_engine"], function (gameEngine) {

});



define("main", function(){});


  // Use almond's special top level synchronous require to trigger factory
  // functions, get the final module, and export it as the public api.
  return require('game_engine');
}));