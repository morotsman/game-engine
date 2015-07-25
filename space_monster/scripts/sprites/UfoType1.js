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
        var rocketPosition = rocket.getPosition();

        var ufoPosition = sprite.getPosition();
        if (Math.abs(ufoPosition.x - rocketPosition.x) < 10) {
            throttledFireCannon();
        }

        if (fireCannon) {
            //new Bullet(engine, ufoPosition.x, ufoPosition.y + sprite.getRadius() + 20, -6).setTeam("Enemy");
            fireCannon = false;
        }
        return result;
    };

    this.handleUpdate = function () {
        var position = this.getPosition();
        if (position.x > 700) {
            this.setSpeedX(-2);
        }
        if (position.x < 100) {
            this.setSpeedX(2);
        }
        var bullets = aggressiveStrategy(this);
        engine.addSprites(bullets);
    };

    var fireCannon = false;


    var throttledFireCannon = util.throttled(6000, function () {
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
        new Explosion(engine, this.getPosition().x,this.getPosition().y,this.getSpeedX(),this.getSpeedY());
    };      

    

}
;




