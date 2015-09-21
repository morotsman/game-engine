Knight.prototype = Object.create(game_engine.sprite.prototype);

function Knight(engine){
    game_engine.sprite.apply(this,arguments);
    
    var that = this;
    var throttledJump = game_engine.util.throttled(500, that.addForceVector);
    var throttledWalk = game_engine.util.throttled(100, that.addForceVector);
    var animationSpeed = 5;
    
    var currentDirection = "none";
    var maxSpeed = 5;
    var force = 0.8;
    var onGround;
    
    this.handleKeyEvents = function (keys) {
        if (keys[39]) {//right
            if(that.getSpeedX() < maxSpeed){
                throttledWalk(0,force);
            }
            if(currentDirection !== "right"){
                currentDirection = "right";
                this.setImage("right_knight").setPosition(that.getX(),that.getY()).setWidthAndHeight(30,30);
            }            
        }else if (keys[37]) {//left
            if(that.getSpeedX() > -maxSpeed){
                throttledWalk(180,force);
            }
            if(currentDirection !== "left"){
                currentDirection = "left";
                this.setImage("left_knight").setPosition(that.getX(),that.getY()).setWidthAndHeight(30,30);
            }              
        } else{
            that.setSpeedX(0);
            if(currentDirection !== "none"){
                if(currentDirection==="right"){
                   this.setImage("static_right_knight").setPosition(that.getX(),that.getY()).setWidthAndHeight(30,30);
                }else{
                  this.setImage("static_left_knight").setPosition(that.getX(),that.getY()).setWidthAndHeight(30,30);
                }
               
                currentDirection = "none";
                
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

    this.setImage("static_right_knight").setPosition(7,50).setWidthAndHeight(30,30);
    
}