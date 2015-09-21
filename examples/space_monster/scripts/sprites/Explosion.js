Explosion.prototype = Object.create(BaseSprite.prototype);

function Explosion(engine, x,y,speedX,speedY){
    BaseSprite.apply(this,arguments);
    
    var that = this;

    
    
    this.handleUpdate = function(){
        if(that.getAnimationCycle() === 19){
           that.setDestroyed(); 
        }
    };
    this.setImage("explosion").setWidthAndHeight(50,50).setPosition(x, y).setSpeedX(speedX).setSpeedY(speedY);
   
}


