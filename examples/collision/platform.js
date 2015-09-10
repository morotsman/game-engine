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
            other.setPosition(other.getX(), that.getY() - other.getHeight());            
            other.setSpeedY(0);
        }else if(side === "down"){
            other.setPosition(other.getX(), that.getY() + that.getHeight());               
            other.setSpeedY(0);
        }else if(side === "left"){
            other.setPosition(that.getX() - other.getWidth(), other.getY());
            other.setSpeedX(0);  
        }else if(side === "right"){
            other.setPosition(that.getX() + that.getWidth(), other.getY());
            other.setSpeedX(0);           
        }
        if(other.setOnGround){
            other.setOnGround(onGround);
        }
        






    };
}

