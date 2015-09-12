define(["Util", "OffScreenHandlerFactory", "RectangularCollisionStartegy", "renderer/Renderer"], function (util, offScreenHandlerFactory, collisionStrategy, Renderer) {

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
                    //if(counter < 59){
                        console.log("frame rate: " + counter);
                    //}
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

                var width = sprite.width;
                var height = sprite.height;
                var direction = undefined;
                var distance = undefined;
                if (sprite.x < 0) {
                    direction = "left";
                    distance = sprite.getX();
                } else if (sprite.x > (screenWidth - width)) {
                    direction = "right";
                    distance = sprite.x - (screenWidth - width);
                } else if (sprite.y < 0) {
                    direction = "top";
                    distance = sprite.y;
                } else if (sprite.y >= (screenHeight - height)) {
                    direction = "down";
                    distance = sprite.y - (screenHeight - height);
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






