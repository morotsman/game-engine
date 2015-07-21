UfoType3.prototype = new UfoType2();

function UfoType3() {
    UfoType2.apply(this, arguments);


    this.getExplosion = function () {
        var position = this.getPosition();
        var ufo1 = new UfoType2().setPosition(position.x-30,position.y).setImage("ufo").setWidthAndHeight(20,20).setHealth(1);
        var ufo2 = new UfoType2().setPosition(position.x+30,position.y).setImage("ufo").setWidthAndHeight(20,20).setHealth(1);
        return [ufo1.setSpeedX(this.getSpeedX()).setSpeedY(this.getSpeedY()), ufo2.setSpeedX(this.getSpeedX()).setSpeedY(this.getSpeedY())];
    };




}
;







