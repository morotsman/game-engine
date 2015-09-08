define([], function () {

    function OffScreenHandlerFactory() {


        var createBouncingOffScreenHandler = function (bounce, friction) {
            return function (sprite, screenWidth, screenHeight, offScreen, now) {
                var widthAndHeight = sprite.getWidthAndHeight();
                var position = sprite.getPosition();
                if (offScreen.direction === "down") {
                    var yPos = screenHeight - widthAndHeight.height - offScreen.distance;
                    sprite.setPosition(position.x, offScreen.distance===0?yPos+1:yPos);
                    sprite.setSpeedY(-sprite.getSpeedY() * bounce);
                    sprite.setSpeedX(sprite.getSpeedX() * (1 - friction));
                } else if (offScreen.direction === "top") {
                    sprite.setPosition(position.x, widthAndHeight.height);
                    sprite.setSpeedY(-sprite.getSpeedY() * bounce);
                    sprite.setSpeedX(sprite.getSpeedX() * (1 - friction));
                } else if (offScreen.direction === "right") {
                    sprite.setPosition(screenWidth - widthAndHeight.width, position.y);
                    sprite.setSpeedX(-sprite.getSpeedX() * bounce);
                } else if (offScreen.direction === "left") {
                    sprite.setPosition(0, position.y);
                    sprite.setSpeedX(-sprite.getSpeedX() * bounce);
                }


            };
        };

        var wrappingOffScreenHandler = function (sprite, screenWidth, screenHeight, offScreen, now) {
            var position = sprite.getPosition();
            var widthAndHeight = sprite.getWidthAndHeight();
            if (offScreen.direction === "right") {
                sprite.setPosition(0, position.y);
            } else if (offScreen.direction === "left") {
                sprite.setPosition(screenWidth - widthAndHeight.width, position.y);
            }
            if (offScreen.direction === "down") {
                sprite.setPosition(position.x, 0);
            } else if (offScreen.direction === "top") {
                sprite.setPosition(position.x, screenHeight - widthAndHeight.height);
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




