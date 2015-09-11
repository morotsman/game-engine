define([], function () {

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




