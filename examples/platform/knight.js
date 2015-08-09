Knight.prototype = Object.create(game_engine.sprite.prototype);

function Knight(engine){
    game_engine.sprite.apply(this,arguments);
    
    var that = this;
    var throttledJump = game_engine.util.throttled(500, that.addForceVector);
    var throttledWalk = game_engine.util.throttled(100, that.addForceVector);
    var speed = 70;
    var left = new game_engine.Animator("left_knight",125, 24, 16, 22, -16, 0, speed, 6,6);
    var right = new game_engine.Animator("right_knight",34, 24, 16, 22, 16, 0, speed, 6,6);
    var stop = new game_engine.Animator("right_knight",34, 24, 16, 22, 16, 0, speed, 1,1);
    
    var currentDirection = "none";
    var maxSpeed = 5;
    var force = 0.8;
    var onGround;
    
    this.handleKeyEvents = function (keys) {
        var position = that.getPosition();
        if (keys[39]) {//right
            if(that.getSpeedX() < maxSpeed){
                throttledWalk(0,force);
            }
            if(currentDirection !== "right"){
                currentDirection = "right";
                that.setAnimator(right).setPosition(position.x,position.y).setWidthAndHeight(30, 30);
            }            
        }else if (keys[37]) {//left
            if(that.getSpeedX() > -maxSpeed){
                throttledWalk(180,force);
            }
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
            if(onGround){
                throttledJump(90,8);
            }
        }

    };   
    
    this.handleUpdate = function(){
        onGround = false;
    };
    
    this.setOnGround = function(_onGround){
        onGround = _onGround;
    };

    this.setAnimator(right).setWidthAndHeight(30, 30);
    
}