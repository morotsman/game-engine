BaseSprite.prototype = Object.create(game_engine.sprite.prototype);

function BaseSprite() {
    game_engine.sprite.apply(this, arguments);

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


    var getOffScreenHandler = function (sprite, screenWidth, screenHeight, direction, now) {
        if (sprite.getX() > screenWidth + 300 || sprite.getX() < -300) {
            sprite.setDestroyed();
        }
        if (sprite.getY() > screenHeight + 300 || sprite.getY() < -300) {
            sprite.setDestroyed();
        }

    };

    this.withOffScreenHandler(getOffScreenHandler);

}
;




