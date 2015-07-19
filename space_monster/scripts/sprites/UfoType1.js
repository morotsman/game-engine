UfoType1.prototype = new BaseSprite();

function UfoType1() {
    BaseSprite.apply(this, arguments);

    var moveStrategy = function (sprite, rocket) {
        var position = sprite.getPosition();
        if (position.x > 700) {
            sprite.setSpeedX(-2);
        }
        if (position.x < 100) {
            sprite.setSpeedX(2);
        }
    };

    var fireCannon = false;


    var throttledFireCannon = util.throttled(6000, function () {
        fireCannon = true;
    });

    var aggressiveStrategy = function (sprite, rocket) {
        var result = [];
        var rocketPosition = rocket.getPosition();

        var ufoPosition = sprite.getPosition();
        if (Math.abs(ufoPosition.x - rocketPosition.x) < 10) {
            throttledFireCannon();
        }

        if (fireCannon) {
            result.push(new Bullet(ufoPosition.x, ufoPosition.y + sprite.getRadius() + 20, -6));
            fireCannon = false;
        }
        return result;
    };

    this.handleCollision = function (other) {
        other.setDamage(2);
    };

    this.getPoints = function () {
        return 1000;
    };


    this.setMoveStrategy(moveStrategy);
    this.setAggressiveStrategy(aggressiveStrategy);

}
;




