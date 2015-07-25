Rocket.prototype = Object.create(BaseSprite.prototype);

function Rocket(engine, screenWidth, screenHeight) {
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

    var throttledAddForceVector = util.throttled(100, that.addForceVector);
    var throttledCannonFired = util.throttled(300, function () {
        that.cannonFired = true;
    });

    var points = 0;


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
            var position = that.getPosition();
            new Bullet(engine, position.x, position.y - that.getRadius(), 5);
            if (bonuses.numberOfCanons > 1) {
                new Bullet(engine, position.x + 20, position.y - that.getRadius(), 5).setTeam("Rocket");
            }
            if (bonuses.numberOfCanons > 2) {
                new Bullet(engine, position.x - 20, position.y - that.getRadius(), 5).setTeam("Rocket");
            }
        }
        return result;
    };

    this.handleUpdate = function () {
        aggressiveStrategy();
    };

    this.handleDestruction = function () {
        new Explosion(engine, this.getPosition().x, this.getPosition().y, this.getSpeedX(), this.getSpeedY())
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

    var offScreenDetector = function (screenWidth, screenHeight, sprite) {
        var position = sprite.getPosition();
        if (position.x > screenWidth || position.x < 0) {
            return true;
        }
        if (position.y > screenHeight || position.y < 0) {
            return true;
        }
    };

    this.getOffScreenDetector = function () {
        return offScreenDetector;
    };

    var offScreenHandler = function (sprite) {
        var position = sprite.getPosition();
        if (position.x > screenWidth) {
            that.setPosition(0, position.y);
        } else if (position.x < 0) {
            that.setPosition(screenWidth, position.y);
        }
        if (position.y > screenHeight) {
            that.setPosition(position.x, 0);
        } else if (position.y < 0) {
            that.setPosition(position.x, screenHeight);
        }
    };

    this.getOffScreenHandler = function () {
        return offScreenHandler;
    };



    this.setHealth(20000);


}
;



