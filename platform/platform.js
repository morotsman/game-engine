Platform.prototype = Object.create(Sprite.prototype);

function Platform(engine, x, y, width, height) {
    Sprite.apply(this, arguments);

    var that = this;
    
    
   
    this.handleUpdate = function () {
        that.addForceVector(90,gravity);
    };

    this.handleCollision = function (other) {
        other.setSpeedY(0);
        other.addForceVector(90,0.1);
        var position = other.getPosition();
        other.setPosition(position.x, that.getPosition().y-other.getWidthAndHeight().height);
    };

    this.setPosition(x,y).setWidthAndHeight(width,height);



}

