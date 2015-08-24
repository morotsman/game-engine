define(["Util","OffScreenHandlerFactory","RectangularCollisionStartegy", "renderer/Renderer"], function (util,offScreenHandlerFactory,collisionStrategy,Renderer) {

    function Engine(canvasId) {

        var requestId;
        var updateHandler;
        var sprites = [];
        var useCollisionDetector = false;
        var that = this;
        var globalOffScreenHandler;
        var renderer = new Renderer(canvasId);


        this.addSprite = function (sprite) {
            sprites.push(sprite);
        };

        this.addSprites = function (_sprites) {
            sprites = sprites.concat(_sprites);
        };

        var updateHandler = function (now, keyEvents) {

        };

        var collisionHandler = function () {

        };

        var destructionHandler = function (sprite) {

        };

        var createBufferedOffScreenDetector = function (bufferX, bufferY) {
            return function (screenWidth, screenHeight, sprite, now) {
                var position = sprite.getPosition();
                var widthAndHeight = sprite.getWidthAndHeight();
                var direction;
                if (position.x < -bufferX) {
                    return "left";
                } else if (position.x > (screenWidth - widthAndHeight.width) + bufferX) {
                    return "right";
                } else if (position.y < -bufferY) {
                    return "top";
                } else if (position.y > (screenHeight - widthAndHeight.height) + bufferY) {
                    return "down";
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
                    console.log(counter);
                    counter = 0;
                    time = now;
                }
            };
        };

        this.start = function () {
            var frameCounter = createFrameCounter();
            var runner = function (now) {
                frameCounter(now);

                var screenWidth = renderer.width();
                var screenHeight = renderer.height();
                renderer.clearRect(0, 0, screenWidth, screenHeight);

                if (useCollisionDetector) {
                    that.detectCollisions(now);
                    sprites.forEach(function (sprite) {
                        if (sprite.isDestroyed(now)) {
                            sprite.handleDestruction(now);
                            destructionHandler(sprite, now);
                        }
                    });
                    sprites.forEach(function (sprite) {
                        var direction = offScreenDetector(screenWidth, screenHeight, sprite);
                        if (direction) {
                            var handled = sprite.handleOffScreen(screenWidth, screenHeight, direction, now);
                            if (!handled) {
                                globalOffScreenHandler(sprite, screenWidth, screenHeight, direction, now);
                            }
                        }
                    });
                    sprites = sprites.filter(function (each) {
                        return !each.isDestroyed(now);
                    });
                }
                updateHandler(now, keyEvents);
                sprites.forEach(function (sprite) {
                    sprite.handleKeyEvents(keyEvents, now);
                    sprite.handleUpdate(now);
                    sprite.draw(renderer, now);
                });
                //console.log(sprites.length);
                requestId = requestAnimationFrame(runner);
            };


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
            sprites.forEach(fun);
        };


    }
    
    return Engine;

});






