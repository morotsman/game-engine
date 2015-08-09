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
        var position = sprite.getPosition();
        if (position.x > screenWidth + 300 || position.x < -300) {
            sprite.setDestroyed();
        }
        if (position.y > screenHeight + 300 || position.y < -300) {
            sprite.setDestroyed();
        }

    };

    this.withOffScreenHandler(getOffScreenHandler);

}
;




