function Engine(canvasId) {

    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    var requestId;
    var updateHandler;
    var sprites = [];
    var useCollisionDetector = false;
    var that = this;
    var collisionStrategy = "circle";
    var offScreenHandlerUtil = new OffScreenHandlerUtil();
    var globalOffScreenHandler;
    

    this.addSprite = function (sprite) {
        sprites.push(sprite);
    };

    this.addSprites = function (_sprites) {
        sprites = sprites.concat(_sprites);
    };

    var updateHandler = function (context, now, keyEvents) {

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

    this.registerUpdateHandler = function (fun) {
        updateHandler = fun;
        return this;
    };

    this.registerCollisionHandler = function (fun) {
        collisionHandler = fun;
        return this;
    };

    this.registerDestructionHandler = function (fun) {
        destructionHandler = fun;
        return this;
    };

    this.withCollisionDetector = function (_collisionStrategy) {
        useCollisionDetector = true;
        collisionStrategy = _collisionStrategy;
        return this;
    };

    this.withGlobalOffScreenHandler = function(something){
        if(util.isFunction(something)){
            globalOffScreenHandler = something;
        }else{  
            globalOffScreenHandler = offScreenHandlerUtil.getOffScreenHandler.apply(this,arguments);
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

            var screenWidth = canvas.width;
            var screenHeight = canvas.height;
            context.clearRect(0, 0, canvas.width, canvas.height);

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
                        if(!handled){
                            globalOffScreenHandler(sprite,screenWidth, screenHeight, direction, now);
                        }
                    }
                });
                sprites = sprites.filter(function (each) {
                    return !each.isDestroyed(now);
                });
            }
            updateHandler(context, now, keyEvents);
            sprites.forEach(function (sprite) {
                sprite.handleKeyEvents(keyEvents, now);
                sprite.handleUpdate(now);
                sprite.draw(context, now);
            });
            console.log(sprites.length);
            requestId = requestAnimationFrame(runner);
        };


        requestId = requestAnimationFrame(runner);
    };

    this.detectCollisions = function () {
        for (var i1 = 0; i1 < sprites.length; i1++) {
            for (var i2 = i1; i2 < sprites.length; i2++) {
                if (sprites[i1].collision(sprites[i2], collisionStrategy) && i1 !== i2) {
                    sprites[i1].handleCollision(sprites[i2]);
                    sprites[i2].handleCollision(sprites[i1]);
                    collisionHandler(sprites[i1], sprites[i2]);
                }
            }
        }
    };

    this.forEach = function (fun) {
        sprites.forEach(fun);
    };


}


