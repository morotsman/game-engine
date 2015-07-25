Explosion.prototype = Object.create(BaseSprite.prototype);

function Explosion(engine, x,y,speedX,speedY){
    BaseSprite.apply(this,arguments);
    
    var that = this;
    
    var moveAnimation = function(){
        if(that.animationCompleted()){
            that.setDestroyed();
        }
    };
    
    
    this.handleUpdate = function(){
        moveAnimation();
    };
   
    
   
    
    this.setAnimation("explosion",80, 10, 200, 200, 320, 250, 20,16).setPosition(x,y).setSpeedX(speedX).setSpeedY(speedY).setWidthAndHeight(50, 50);
    
}


