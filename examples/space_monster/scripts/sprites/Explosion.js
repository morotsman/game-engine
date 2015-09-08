Explosion.prototype = Object.create(BaseSprite.prototype);

function Explosion(engine, x,y,speedX,speedY){
    BaseSprite.apply(this,arguments);
    
    var that = this;

    
    
    this.handleUpdate = function(){
        if(that.getAnimationCycle() > 0){
           that.setDestroyed(); 
        }
    };
    this.setImage("explosion",20,4,320,240,20).setWidthAndHeight(50,50).setPosition(x, y).setSpeedX(speedX).setSpeedY(speedY);
   
}


