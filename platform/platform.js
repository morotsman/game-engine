Platform.prototype = Object.create(Sprite.prototype);
function Platform(engine) {
    Sprite.apply(this, arguments);
    var that = this;
    var bounce = 0.5;
    this.handleUpdate = function () {
        that.addForceVector(90, gravity);
    };
    var reverseAngle = function (angle) {
        return (angle + 180) % 360;
    };

/*
http://gamedev.stackexchange.com/questions/29786/a-simple-2d-rectangle-collision-algorithm-that-also-determines-which-sides-that
 */
    var getSide = function (sprite1, sprite2) {
        var sprite1Width = sprite1.getWidthAndHeight().width;
        var sprite1Height = sprite1.getWidthAndHeight().height;
        var sprite1CenterX = sprite1.getPosition().x  + sprite1Width/2;
        var sprite1CenterY = sprite1.getPosition().y  + sprite1Height/2;
        
        var sprite2Width = sprite2.getWidthAndHeight().width;
        var sprite2Height = sprite2.getWidthAndHeight().height;
        var sprite2CenterX = sprite2.getPosition().x  + sprite2Width/2;
        var sprite2CenterY = sprite2.getPosition().y  + sprite2Height/2;        
        
        
        
        var w = 0.5 * (sprite1Width + sprite2Width);
        var h = 0.5 * (sprite1Height + sprite2Height);
        var dx = sprite1CenterX - sprite2CenterX;
        var dy = sprite1CenterY - sprite2CenterY;
        if (Math.abs(dx) <= w && Math.abs(dy) <= h)
        {
            /* collision! */
            var wy = w * dy;
            var hx = h * dx;
            if (wy > hx) {
                if (wy > -hx) {
                    return "top";
                } else {
                    return "right";
                }
            } else {
                if (wy > -hx) {
                    return "left";
                } else {
                    return "down";
                }
            }

        }
    };


    this.handleCollision = function (other) {
        var side = getSide(that,other); 
        var onGround = false;
        if (side === "top") {
            other.setSpeedY(0);
            other.addForceVector(90, 0.1);
            var position = other.getPosition();
            other.setPosition(position.x, that.getPosition().y - other.getWidthAndHeight().height);
            onGround = true;
        }else if(side === "down"){
            var speedY = other.getSpeedY();
            other.setSpeedY(-speedY);
        }else if(side === "left"){
            var speedX = other.getSpeedX();
            if(speedX > 0){
                other.addForceVector(180,speedX*1.4);
            }   
        }else if(side === "right"){
            var speedX = other.getSpeedX();
            if(speedX < 0){
                other.addForceVector(180,speedX*1.4);
            }            
        }
        other.setOnGround(onGround);






    };
}

