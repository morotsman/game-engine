Knight.prototype = Object.create(Sprite.prototype);

function Knight(engine,x,y){
    Sprite.apply(this,arguments);
    
    var that = this;
    var throttledJump = util.throttled(1000, that.addForceVector);
    var speed = 70;
    var left = new Animator("left_knight",125, 24, 16, 22, -16, 0, speed, 6,6);
    var right = new Animator("right_knight",34, 24, 16, 22, 16, 0, speed, 6,6);
    var stop = new Animator("right_knight",34, 24, 16, 22, 16, 0, speed, 1,1);
    
    var currentDirection = "none";
    
    
    this.handleKeyEvents = function (keys) {
        var position = that.getPosition();
        if (keys[39]) {//right
            that.setSpeedX(2);
            if(currentDirection !== "right"){
                currentDirection = "right";
                that.setAnimator(right).setPosition(position.x,position.y).setWidthAndHeight(30, 30);
            }            
        }else if (keys[37]) {//left
            that.setSpeedX(-2);
            if(currentDirection !== "left"){
                currentDirection = "left";
                that.setAnimator(left).setPosition(position.x,position.y).setWidthAndHeight(30, 30);
            }              
        } else{
            that.setSpeedX(0);
            if(currentDirection !== "none"){
                currentDirection = "none";
                that.setAnimator(stop).setPosition(position.x,position.y).setWidthAndHeight(30, 30);
            }    
        }     
       
        if (keys[32]) {//space
            throttledJump(90,10);
        }

    };    

    this.setAnimator(right).setPosition(x,y).setWidthAndHeight(30, 30);
    
}