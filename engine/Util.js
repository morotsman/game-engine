var util = {
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
    createBufferedOffScreenDetector: function (bufferX, bufferY) {
        return function (screenWidth, screenHeight, sprite, now) {
            var position = sprite.getPosition();
            var widthAndHeight = sprite.getWidthAndHeight();
            if (position.x < -bufferX) {
                return "left";
            } else if (position.x > screenWidth - widthAndHeight.width + bufferX) {
                return "right";
            } else if (position.y < -bufferY) {
                return "top";
            } else if (position.y > (screenHeight-widthAndHeight.height) + bufferY) {
                return "down";
            }
            return undefined;
        };
    },
    bouncingOffScreenHandler: function (bounce, friction) {
        return function (sprite, screenWidth, screenHeight, direction) {
            var widthAndHeight = sprite.getWidthAndHeight();
            var position = sprite.getPosition();
            if (direction === "down") {
                sprite.setPosition(position.x, screenHeight - widthAndHeight.height);
                sprite.setSpeedY(-sprite.getSpeedY() * bounce);
                sprite.setSpeedX(sprite.getSpeedX() * (1 - friction));
            } else if (direction === "top") {
                sprite.setPosition(position.x, widthAndHeight.height);
                sprite.setSpeedY(-sprite.getSpeedY() * bounce);
                sprite.setSpeedX(sprite.getSpeedX() * (1 - friction));
            } else if (direction === "right") {
                sprite.setPosition(screenWidth - widthAndHeight.width, position.y);
                sprite.setSpeedX(-sprite.getSpeedX() * bounce);
            } else if (direction === "left") {
                sprite.setPosition(0, position.y);
                sprite.setSpeedX(-sprite.getSpeedX() * bounce);
            }


        };
    },
    wrappingOffScreenHandler : function (sprite,screenWidth,screenHeight) {
        var position = sprite.getPosition();
        if (position.x > screenWidth) {
            sprite.setPosition(0, position.y);
        } else if (position.x < 0) {
            sprite.setPosition(screenWidth, position.y);
        }
        if (position.y > screenHeight) {
            sprite.setPosition(position.x, 0);
        } else if (position.y < 0) {
            sprite.setPosition(position.x, screenHeight);
        }
    },
    destructiveOffscreenHandler : function(sprite){
        sprite.setDestroyed();
    }


};


