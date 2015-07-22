Bonus.prototype = new BaseSprite();

function Bonus(screenWidth){
    BaseSprite.apply(this,arguments);
    
    

    
    this.handleCollision = function(other){
        if(other.receiveBonus){
            other.receiveBonus();
            this.setDestroyed();
        }
        
    }; 
    
    this.setImage("bonus").setPosition(screenWidth/2, 0).setWidthAndHeight(30, 30).setSpeedY(-2);
    
    
    
}


