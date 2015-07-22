BaseSprite.prototype = new Sprite();

function BaseSprite() {
    Sprite.apply(this,arguments);

    var health;
    var destroyed = false;
    var rocketPosition;
    var rocket;
    
    this.getType = function(){
        return "BaseSprite";
    };
    
    this.getTeam = function(){
        return "";
    };      
    
    var moveStrategy = function(){
        
    };
    
    var aggressiveStrategy = function(){
        return [];
    };
    
    var keyStrategy = function(){
        
    };
    
    
    this.setHealth = function(_health){
        health = _health;
        return this;
    };
    
    this.setMoveStrategy = function(fun){
        moveStrategy = fun;
        return this;
    };
    
    this.setAggressiveStrategy = function(fun){
        aggressiveStrategy = fun;
        return this;
    };
    
    this.handleKeyEvents = function (keys) {
        keyStrategy(keys);
    };
    
    this.setKeyStrategy = function(fun){
        keyStrategy = fun;
        return this;
    };

    this.update = function (context,_rocket) {
        rocket = _rocket;
        moveStrategy(this,rocket);  
        this.draw(context);
    };
       
    this.bulletFired = function(){
        return aggressiveStrategy(this,rocket);
    };       
    
    
    this.setDamage = function(_damage){
        health = health - _damage;
        if(health <= 0){
            destroyed = true;
        }
    };
    
    
    this.getExplosion = function(){
        var position = this.getPosition();
        return [new Explosion(position.x,position.y,this.getSpeedX(),this.getSpeedY())];
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
    
    
};




