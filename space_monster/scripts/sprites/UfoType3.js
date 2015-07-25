UfoType3.prototype = Object.create(UfoType2.prototype);

function UfoType3(engine,rocket) {
    UfoType2.apply(this, arguments);


    this.handleDestruction = function(){
        var position = this.getPosition();
        var ufo1 = new UfoType2(engine,rocket).setPosition(position.x-30,position.y).setImage("ufo").setWidthAndHeight(20,20).setHealth(1);
        var ufo2 = new UfoType2(engine,rocket).setPosition(position.x+30,position.y).setImage("ufo").setWidthAndHeight(20,20).setHealth(1);
    };



}
;







