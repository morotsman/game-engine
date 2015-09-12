define([], function () {

    function OffScreenHandlerFactory() {


        var createBouncingOffScreenHandler = function (bounce, friction) {
            return function (sprite, screenWidth, screenHeight, direction,distance, now) {
                if (direction === "down") {
                    var yPos = screenHeight - sprite.height - distance;
                    sprite.y = (distance===0?yPos+1:yPos);
                    sprite.speedY = -sprite.speedY * bounce;
                    sprite.speedX = sprite.speedX * (1 - friction);
                } else if (direction === "top") {
                    sprite.y = sprite.height;
                    sprite.speedY = -sprite.speedY * bounce;
                    sprite.speedX = sprite.speedX * (1 - friction);
                } else if (direction === "right") {
                    sprite.x = screenWidth - sprite.width;
                    sprite.speedX = -sprite.speedX * bounce;
                } else if (direction === "left") {
                    sprite.x = 0;
                    sprite.speedX = -sprite.speedX * bounce;
                }


            };
        };

        var wrappingOffScreenHandler = function (sprite, screenWidth, screenHeight, direction,distance, now) {
            if (direction === "right") {
                sprite.setPosition(0, sprite.y);
            } else if (direction === "left") {
                sprite.setPosition(screenWidth - sprite.width, sprite.y);
            }
            if (direction === "down") {
                sprite.setPosition(sprite.x, 0);
            } else if (direction === "top") {
                sprite.setPosition(sprite.x, screenHeight - sprite.height);
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




