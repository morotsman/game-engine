Platform.prototype = Object.create(Sprite.prototype);
function Platform(engine) {
    Sprite.apply(this, arguments);
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
            other.setSpeedY(0);
        }else if(side === "down"){
            other.setSpeedY(0);
        }else if(side === "left"){
            other.setSpeedY(0);  
        }else if(side === "right"){
            other.setSpeedY(0);           
        }
        if(other.setOnGround){
            other.setOnGround(onGround);
        }
        






    };
}

