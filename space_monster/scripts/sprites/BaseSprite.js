BaseSprite.prototype = Object.create(Sprite.prototype);

function BaseSprite() {
    Sprite.apply(this,arguments);

    var health;
    var destroyed = false;

    
    this.getType = function(){
        return "BaseSprite";
    };
    
    this.getTeam = function(){
        return "";
    };      
    
    
    this.setHealth = function(_health){
        health = _health;
        return this;
    };

            
    
    
    this.setDamage = function(_damage){
        health = health - _damage;
        if(health <= 0){
            destroyed = true;
        }
    };
    
    
    this.setDestroyed = function(){
        destroyed = true;
    };
    
    
    this.isDestroyed = function(){
        return destroyed;
    };    
    
    this.getPoints = function(){
        return 0;
    };
    
    this.addPoints = function(){
        
    };
    
    
};




