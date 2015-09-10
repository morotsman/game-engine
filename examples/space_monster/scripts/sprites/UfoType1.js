UfoType1.prototype = Object.create(BaseSprite.prototype);

function UfoType1(engine, rocket) {
    BaseSprite.apply(this, arguments);
    
    this.getType = function(){
        return "Enemy";
    };      
    
    this.getTeam = function(){
        return "Enemy";
    };     

    var aggressiveStrategy = function (sprite) {
        var result = [];

        if (Math.abs(sprite.getX() - rocket.getX()) < 10) {
            throttledFireCannon();
        }

        if (fireCannon) {
            new Bullet(engine, sprite.getX(), sprite.getY() + sprite.getRadius() + 30, -6).setTeam("Enemy");
            fireCannon = false;
        }
        return result;
    };

    this.handleUpdate = function () {
        if (this.getX() > 700) {
            this.setSpeedX(-2);
        }
        if (this.getX() < 100) {
            this.setSpeedX(2);
        }
        var bullets = aggressiveStrategy(this);
        engine.addSprites(bullets);
    };

    var fireCannon = false;


    var throttledFireCannon = game_engine.util.throttled(6000, function () {
        fireCannon = true;
    });



    this.handleCollision = function (other) {
        if(other.getTeam() !== "Enemy"){
            other.setDamage(2);
        }
    };
    
    this.getPoints = function(){
        return 1000;
    };
    
    this.handleDestruction = function(){
        new Explosion(engine, this.getX(),this.getY(),this.getSpeedX(),this.getSpeedY());
    };      

    

}
;




