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
        return function (screenWidth, screenHeight, sprite, now, offScreenHandler) {
            var position = sprite.getPosition();
            var widthAndHeight = sprite.getWidthAndHeight();
            var direction;
            if (position.x < -bufferX) {
                direction = "left";
            } else if (position.x > (screenWidth - widthAndHeight.width) + bufferX) {
                direction =  "right";
            } else if (position.y < -bufferY) {
                direction =  "top";
            } else if (position.y > (screenHeight-widthAndHeight.height) + bufferY) {
                direction =  "down";
            }else {
                return;
            }
            offScreenHandler(sprite, screenWidth, screenHeight, direction, now, bufferX, bufferY);
            
        };
    },
    bouncingOffScreenHandler: function (bounce, friction) {
        return function (sprite, screenWidth, screenHeight, direction,now,bufferX,bufferY) {
            var widthAndHeight = sprite.getWidthAndHeight();
            var position = sprite.getPosition();
            if (direction === "down") {
                sprite.setPosition(position.x, screenHeight + bufferY - widthAndHeight.height);
                sprite.setSpeedY(-sprite.getSpeedY() * bounce);
                sprite.setSpeedX(sprite.getSpeedX() * (1 - friction));
            } else if (direction === "top") {
                sprite.setPosition(position.x, widthAndHeight.height + bufferY);
                sprite.setSpeedY(-sprite.getSpeedY() * bounce);
                sprite.setSpeedX(sprite.getSpeedX() * (1 - friction));
            } else if (direction === "right") {
                sprite.setPosition(screenWidth + bufferX - widthAndHeight.width, position.y);
                sprite.setSpeedX(-sprite.getSpeedX() * bounce);
            } else if (direction === "left") {
                sprite.setPosition(-bufferX, position.y);
                sprite.setSpeedX(-sprite.getSpeedX() * bounce);
            }


        };
    },
    wrappingOffScreenHandler : function (sprite, screenWidth, screenHeight, direction, now, bufferX, bufferY) {
        var position = sprite.getPosition();
        var widthAndHeight = sprite.getWidthAndHeight();
        if (direction === "right") {
            sprite.setPosition(-bufferX, position.y);
        } else if (direction === "left") {
            sprite.setPosition(screenWidth+bufferX-widthAndHeight.width, position.y);
        }
        if (direction === "down") {
            sprite.setPosition(position.x, -bufferY);
        } else if (direction === "top") {
            sprite.setPosition(position.x, screenHeight+bufferY-widthAndHeight.height);
        }
    },
    destructiveOffscreenHandler : function(sprite){
        sprite.setDestroyed();
    }


};


