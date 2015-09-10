UfoType2.prototype = Object.create(BaseSprite.prototype);

function UfoType2(engine,rocket) {
    BaseSprite.apply(this, arguments);

    var throttledAddForceVector = game_engine.util.throttled(150, this.addForceVector);
    var throttledBreakForceVector = game_engine.util.throttled(50, this.addForceVector);
    var that = this;
    var breakeAngle;
    
    this.getType = function(){
        return "Enemy";
    };     
    
    this.getTeam = function(){
        return "Enemy";
    };    


    var inBreakZone = function (sprite) {
        return sprite.getX() > 725 || sprite.getX() < 40 || sprite.getY() < 40 || sprite.getY() > 525;
    };

    var reverseAngle = function (angle) {
        return (angle + 180) % 360;
    };
    


    var initUpdateStrategy = function () {
        if (inBreakZone(that)) {
            var angleAndDistance = that.getAngleAndDistance(rocket);
            throttledAddForceVector(angleAndDistance.angle, 0.5);
        } else if (!inBreakZone(that)) {
            currentUpdateStrategy = searchUpdateStrategy;
        }
    };

    var searchUpdateStrategy = function () {
        if (inBreakZone(that)) {
            var forceVector = that.getForceVector();
            breakeAngle = reverseAngle(forceVector.angle);
            currentUpdateStrategy = breakMoveStrategy;
            return;
        }

        var angleAndDistance = that.getAngleAndDistance(rocket);
        if (angleAndDistance.distance > 300) {
            throttledAddForceVector(angleAndDistance.angle, 1);
        } else if (angleAndDistance.distance > 200) {
            throttledAddForceVector(angleAndDistance.angle, 0.5);
        } else if (angleAndDistance.distance > 100) {
            throttledAddForceVector(angleAndDistance.angle, 0.25);
        } else if (angleAndDistance.distance > 50) {
            throttledAddForceVector(angleAndDistance.angle, 0.1);
        } else {
            throttledAddForceVector(angleAndDistance.angle, 0.05);
        }
    };

    var breakMoveStrategy = function () {
        var forceVector = that.getForceVector();
        throttledBreakForceVector(breakeAngle, forceVector.force / 2);
        if (forceVector.force < 0.01) {
            currentUpdateStrategy = initUpdateStrategy;
        }
    };


    this.getPoints = function () {
        return 1000;
    };

    this.handleCollision = function (other) {
        if(other.getTeam() === "Rocket"){
            other.setDamage(2);
        }     
    };
    
    var currentUpdateStrategy = initUpdateStrategy;
    
    this.handleUpdate = function(){
        currentUpdateStrategy();
    };
    
    this.handleDestruction = function(){
        new Explosion(engine, this.getX(),this.getY(),this.getSpeedX(),this.getSpeedY());
    };   


}
;







