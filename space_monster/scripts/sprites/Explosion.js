Explosion.prototype = new BaseSprite();

function Explosion(x,y,speedX,speedY){
    BaseSprite.apply(this,arguments);
    
    var moveAnimation = function(that){
        if(that.animationCompleted()){
            that.setDestroyed();
        }
    };
    
    this.getExplosion = function(){
        return [];
    };
    
    
    this.setAnimation("explosion",80, 10, 200, 200, 320, 250, 20,16).setPosition(x,y).setSpeedX(speedX).setSpeedY(speedY).setWidthAndHeight(50, 50).setMoveStrategy(moveAnimation);
    
}


