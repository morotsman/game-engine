UfoType3.prototype = Object.create(UfoType2.prototype);

function UfoType3(engine,rocket) {
    UfoType2.apply(this, arguments);


    this.handleDestruction = function(){
        var ufo1 = new UfoType2(engine,rocket).setPosition(this.getX()-30,this.getY()).setImage("ufo").setWidthAndHeight(15,5).setHealth(1);
        var ufo2 = new UfoType2(engine,rocket).setPosition(this.getX()+30,this.getY()).setImage("ufo").setWidthAndHeight(15,5).setHealth(1);
    };



}
;







