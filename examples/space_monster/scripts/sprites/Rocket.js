Rocket.prototype = Object.create(BaseSprite.prototype);

function Rocket(engine) {
    BaseSprite.apply(this, arguments);

    var cannonFired = false;
    var that = this;
    var bonuses = {
        numberOfCanons: 1
    };

    this.getType = function () {
        return "Rocket";
    };

    this.getTeam = function () {
        return "Rocket";
    };

    var throttledAddForceVector = game_engine.util.throttled(100, that.addForceVector);
    var throttledCannonFired = game_engine.util.throttled(300, function () {
        that.cannonFired = true;
    });


    this.handleKeyEvents = function (keys) {
        if (keys[39]) {//right
            throttledAddForceVector(0, 1);
        }
        if (keys[37]) {//left
            throttledAddForceVector(180, 1);
        }
        if (keys[38]) {//up
            throttledAddForceVector(90, 1);
        }
        if (keys[40]) {//down
            throttledAddForceVector(270, 1);
        }

        if (keys[32]) {//space
            //fire cannon
            throttledCannonFired();
        }

    };

    var aggressiveStrategy = function () {
        var result = [];
        if (that.cannonFired === true) {

            that.cannonFired = false;
            new Bullet(engine, that.getX(), that.getY() - that.getRadius()*2, 5);
            if (bonuses.numberOfCanons > 1) {
                new Bullet(engine, that.getX() + 20, that.getY() - that.getRadius()*2, 5).setTeam("Rocket");
            }
            if (bonuses.numberOfCanons > 2) {
                new Bullet(engine, that.getX() - 20, that.getY() - that.getRadius()*2, 5).setTeam("Rocket");
            }
        }
        return result;
    };

    this.handleUpdate = function () {
        aggressiveStrategy();
    };

    this.handleDestruction = function () {
        new Explosion(engine, this.getX(), this.getY(), this.getSpeedX(), this.getSpeedY());
    };


    this.handleCollision = function (other) {
        if (other.getTeam() === "Enemy") {
            other.setDamage(2);
        }

    };

    this.receiveBonus = function (bonus) {
        if (bonuses.numberOfCanons < 3) {
            bonuses.numberOfCanons = bonuses.numberOfCanons + 1;
        }
    };




    this.setHealth(4).withOffScreenHandler("wrapping");


}
;



