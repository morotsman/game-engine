BaseSprite.prototype = Object.create(Sprite.prototype);

function BaseSprite() {
    Sprite.apply(this, arguments);

    var health;

    this.getType = function () {
        return "BaseSprite";
    };

    this.getTeam = function () {
        return "";
    };


    this.setHealth = function (_health) {
        health = _health;
        return this;
    };




    this.setDamage = function (_damage) {
        health = health - _damage;
        if (health <= 0) {
            this.setDestroyed();
        }
    };

    this.getPoints = function () {
        return 0;
    };

    this.addPoints = function () {

    };

    var offScreenDetector = function (screenWidth, screenHeight, sprite) {
        var position = sprite.getPosition();
        if (position.x < -1000 || position.x > screenWidth + 1000) {
            return true;
        }
        if (position.y < -1000 || position.y > screenHeight + 1000) {
            return true;
        }
    };

    this.getOffScreenDetector = function () {
        return offScreenDetector;
    };

    var offScreenHandler = function (sprite) {
        sprite.setDestroyed();
    };

    this.getOffScreenHandler = function () {
        return offScreenHandler;
    };


}
;




