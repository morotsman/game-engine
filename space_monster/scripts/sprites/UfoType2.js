UfoType2.prototype = new BaseSprite();

function UfoType2() {
    BaseSprite.apply(this, arguments);

    var throttledAddForceVector = util.throttled(100, this.addForceVector);
    var throttledBreakForceVector = util.throttled(50, this.addForceVector);
    var breaking = false;
    var that = this;
    var breakeAngle;

    var init = true;

    var inBreakZone = function (sprite) {
        var position = sprite.getPosition();
        return position.x > 725 || position.x < 40 || position.y < 40 || position.y > 525;
    };

    var reverseAngle = function (angle) {
        return (angle + 180) % 360;
    }





    var moveStrategy = function (sprite, rocket) {

        if (init && inBreakZone(sprite)) {
            var angleAndDistance = sprite.getAngleAndDistance(rocket);
            throttledAddForceVector(angleAndDistance.angle, 0.5);
            return;
        } else if (init && !inBreakZone(sprite)) {
            init = false;
            return;
        }

        if (inBreakZone(sprite) && !that.breaking) {
            that.breaking = true;
            var forceVector = sprite.getForceVector();
            breakeAngle = reverseAngle(forceVector.angle);
            return;
        }

        if (that.breaking) {
            var forceVector = sprite.getForceVector();
            throttledBreakForceVector(breakeAngle, forceVector.force / 2);
            if (forceVector.force < 0.01) {
                init = true;
                that.breaking = false;
            }
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


    this.getPoints = function () {
        return 1000;
    };

    this.handleCollision = function (other) {
        other.setDamage(2);
    };

    this.setMoveStrategy(moveStrategy);


}
;







