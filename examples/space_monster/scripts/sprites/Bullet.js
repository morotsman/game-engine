Bullet.prototype = Object.create(BaseSprite.prototype);

function Bullet(engine,x,y, speed){
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
    
    this.handleDestruction = function(){
        new Explosion(engine, this.getX(),this.getY(),0,0);
    };    
             
    this.handleCollision = function(other){
        if(other.getType() !== "Bullet" && other.getTeam() !== team){
            other.setDamage(1);
        }  
    }; 
    
    this.setImage("bullet").setWidthAndHeight(15, 15).setSpeedY(speed).setPosition(x,y).setHealth(1); 
    
    
}


