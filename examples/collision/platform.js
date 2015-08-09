Platform.prototype = Object.create(game_engine.sprite.prototype);
function Platform(engine) {
    game_engine.sprite.apply(this, arguments);
    var that = this;
    var bounce = 0.5;
    
    
    this.handleUpdate = function () {
        
    };
    var reverseAngle = function (angle) {
        return (angle + 180) % 360;
    };



    this.handleCollision = function (other,side) { 
        var onGround = false;
        if (side === "top") {
            var position = other.getPosition();
            other.setPosition(position.x, that.getPosition().y - other.getWidthAndHeight().height);            
            other.setSpeedY(0);
        }else if(side === "down"){
            var position = other.getPosition();
            other.setPosition(position.x, that.getPosition().y + that.getWidthAndHeight().height);               
            other.setSpeedY(0);
        }else if(side === "left"){
            var position = other.getPosition();
            other.setPosition(that.getPosition().x - other.getWidthAndHeight().width, position.y);
            other.setSpeedX(0);  
        }else if(side === "right"){
            var position = other.getPosition();
            other.setPosition(that.getPosition().x + that.getWidthAndHeight().width, position.y);
            other.setSpeedX(0);           
        }
        if(other.setOnGround){
            other.setOnGround(onGround);
        }
        






    };
}

