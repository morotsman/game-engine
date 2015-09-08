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

        var createBufferedOffScreenDetector = function () {
            return function (screenWidth, screenHeight, sprite, now) {
                var position = sprite.getPosition();
                var widthAndHeight = sprite.getWidthAndHeight();
                var direction;
                if (position.x < 0) {
                    return {
                        direction: "left",
                        distance: position.x
                    };
                } else if (position.x > (screenWidth - widthAndHeight.width)) {
                    return {
                        direction: "right",
                        distance: position.x - (screenWidth - widthAndHeight.width)
                    };
                } else if (position.y < 0) {
                    return {
                        direction: "top",
                        distance: position.y
                    };
                } else if (position.y >= (screenHeight - widthAndHeight.height)) {
                    return {
                        direction: "down",
                        distance: position.y - (screenHeight - widthAndHeight.height)
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
                    console.log(counter);
                    counter = 0;
                    time = now;
                }
            };
        };

        var frameCounter = createFrameCounter();
        var runner = function (now) {
            frameCounter(now);
            requestId = requestAnimationFrame(runner);

            var screenWidth = renderer.width();
            var screenHeight = renderer.height();
            renderer.clearRect(0, 0, screenWidth, screenHeight);
            
            if (useCollisionDetector) {
                that.detectCollisions(now);
                for (var i = 0; i < sprites.length; i++) {
                    if (sprites[i].isDestroyed(now)) {
                        sprites[i].handleDestruction(now);
                        destructionHandler(sprites[i], now);
                    }
                }
            }
            
            if (updateHandler) {
                updateHandler(now, keyEvents);
            }    
            
            for (var i = 0; i < sprites.length; i++) {
                sprites[i].handleKeyEvents(keyEvents, now);
                sprites[i].handleUpdate(now);  
                sprites[i].tick();
            }            
            
            for (var i = 0; i < sprites.length; i++) {
                var offScreen = offScreenDetector(screenWidth, screenHeight, sprites[i]);
                if (offScreen) {
                    var handled = sprites[i].handleOffScreen(screenWidth, screenHeight, offScreen, now);
                    if (!handled && globalOffScreenHandler) {
                        globalOffScreenHandler(sprites[i], screenWidth, screenHeight, offScreen, now);
                    }
                }
            }
            
           
            var filteredSprites = [];
            for (var i = 0; i < sprites.length; i++) {
                if(!sprites[i].isDestroyed(now)){
                    filteredSprites.push(sprites[i]);
                }
            }
            

            for(var i=0; i < filteredSprites.length; i++){
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
            for(var i = 0; i < sprites.length; i++ ){
                fun(sprites[i]);
            }
        };


    }

    return Engine;

});






