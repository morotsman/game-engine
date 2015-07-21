UfoType2.prototype = new BaseSprite();

function UfoType2() {
    BaseSprite.apply(this, arguments);

    var throttledAddForceVector = util.throttled(150, this.addForceVector);
    var throttledBreakForceVector = util.throttled(50, this.addForceVector);
    var that = this;
    var breakeAngle;
    
    this.getType = function(){
        return "Enemy";
    };     
    
    this.getTeam = function(){
        return "Enemy";
    };    


    var inBreakZone = function (sprite) {
        var position = sprite.getPosition();
        return position.x > 725 || position.x < 40 || position.y < 40 || position.y > 525;
    };

    var reverseAngle = function (angle) {
        return (angle + 180) % 360;
    };



    var initMoveStrategy = function (sprite, rocket) {
        if (inBreakZone(sprite)) {
            var angleAndDistance = sprite.getAngleAndDistance(rocket);
            throttledAddForceVector(angleAndDistance.angle, 0.5);
        } else if (!inBreakZone(sprite)) {
            that.setMoveStrategy(searchMoveStrategy);
        }
    };

    var searchMoveStrategy = function (sprite, rocket) {
        if (inBreakZone(sprite)) {
            var forceVector = sprite.getForceVector();
            breakeAngle = reverseAngle(forceVector.angle);
            that.setMoveStrategy(breakMoveStrategy);
            return;
        }

        var angleAndDistance = sprite.getAngleAndDistance(rocket);
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

    var breakMoveStrategy = function (sprite, rocket) {
        var forceVector = sprite.getForceVector();
        throttledBreakForceVector(breakeAngle, forceVector.force / 2);
        if (forceVector.force < 0.01) {
            that.setMoveStrategy(initMoveStrategy);
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

    this.setMoveStrategy(initMoveStrategy);


}
;







