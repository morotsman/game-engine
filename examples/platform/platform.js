Platform.prototype = Object.create(game_engine.sprite.prototype);
function Platform(engine) {
    game_engine.sprite.apply(this, arguments);
    var that = this;
    var bounce = 0.5;
    this.handleUpdate = function () {
        that.addForceVector(90, gravity);
    };
    var reverseAngle = function (angle) {
        return (angle + 180) % 360;
    };



    this.handleCollision = function (other,side) { 
        var onGround = false;
        if (side === "top") {
            other.setSpeedY(that.getSpeedY());
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
        if(other.setOnGround){
            other.setOnGround(onGround);
        }
        






    };
}

