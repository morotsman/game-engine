function OffScreenHandlerUtil(){
       
    
   var createBouncingOffScreenHandler = function (bounce, friction) {
        return function (sprite, screenWidth, screenHeight, direction,now) {
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
    };
    
    var wrappingOffScreenHandler = function (sprite, screenWidth, screenHeight, direction, now) {
        var position = sprite.getPosition();
        var widthAndHeight = sprite.getWidthAndHeight();
        if (direction === "right") {
            sprite.setPosition(0, position.y);
        } else if (direction === "left") {
            sprite.setPosition(screenWidth-widthAndHeight.width, position.y);
        }
        if (direction === "down") {
            sprite.setPosition(position.x, 0);
        } else if (direction === "top") {
            sprite.setPosition(position.x, screenHeight-widthAndHeight.height);
        }
    };
    
    var destructiveOffscreenHandler = function(sprite){
        sprite.setDestroyed();
    };    
    
    
    this.getOffScreenHandler = function (wrapper) {
        if(wrapper === "wrapping"){
            return wrappingOffScreenHandler;
        }else if(wrapper === "bouncing"){
            return createBouncingOffScreenHandler.apply(this,Array.prototype.slice.call(arguments, 1));
        }else if(wrapper === "destructive"){
            return destructiveOffscreenHandler;
        }
    };    
    
}


