Bullet.prototype = new BaseSprite();

function Bullet(x,y, speed){
    BaseSprite.apply(this,arguments);
    
    var team = "";
    
    this.setTeam = function(_team){
        team = _team; 
        return this;
    };
   
    this.getType = function(){
        return "Bullet";
    }; 
    
    this.getTeam = function(){
        return team;
    };      
    
    this.getDamage = function(){
        return 1;
    };
    
    this.getExplosion = function(){
        console.log("getExplosion");
        var position = this.getPosition();
        return [new Explosion(position.x,position.y,0,0)];
    };        
    
    this.handleCollision = function(other){
        if(other.getType() !== "Bullet" && other.getTeam() !== team){
            console.log("damage");
            other.setDamage(1);
        }
        
    }; 
    
    this.setImage("bullet").setWidthAndHeight(15, 15).setSpeedY(speed).setPosition(x,y).setHealth(1); 
    
    
}


