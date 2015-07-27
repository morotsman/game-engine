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

    this.getOffScreenDetector = function () {
        return util.createBufferedOffScreenDetector(1000,1000);
    };


    this.getOffScreenHandler = function () {
        return util.destructiveOffscreenHandler;
    };


}
;




