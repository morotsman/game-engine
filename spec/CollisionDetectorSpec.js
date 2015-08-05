describe("Collision detector", function () {
   
    function MockSprite(x,y,width,height,speedX,speedY){
        this.getPosition = function() {
            return {
                x:x,
                y:y
            };
        };
        this.getWidthAndHeight = function(){
            return {
                width:width,
                height:height
            };
        };
        this.getSpeedX = function(){
            return speedX;
        };
        this.getSpeedY = function(){
            return speedY;
        };           
    };
   
    var spriteCreator = function(x,y,width,height,speedX,speedY){
        return new MockSprite(x,y,width,height,speedX,speedY);
        
    };
    
    var unitUnderTest;

    beforeEach(function () {
        unitUnderTest = new RectangularCollisionStartegy();
    });    
    
    it("should be able to detect that two stationary non touching sprites does not collide", function () {
        var sprite1 = spriteCreator(10,10,10,10,0,0);
        var sprite2 = spriteCreator(100,100,10,10,0,0);
        var result = unitUnderTest.collision(sprite1,sprite2);
        expect(result).toEqual(undefined);
        
        var sprite1 = spriteCreator(10,10,10,10,0,0);
        var sprite2 = spriteCreator(0,10,9.99,10,0,0);
        var result = unitUnderTest.collision(sprite1,sprite2);
        expect(result).toEqual(undefined);        
    });
    
    it("should be able to detect that two sprites that are completly overlapping collides", function () {
        var sprite1 = spriteCreator(10,10,10,10,0,0);
        var sprite2 = spriteCreator(10,10,10,10,0,0);
        var result = unitUnderTest.collision(sprite1,sprite2);
        expect(result).toEqual("left");
        
        var sprite1 = spriteCreator(10,10,10,10,0,0);
        var sprite2 = spriteCreator(11,11,5,5,0,0);
        var result = unitUnderTest.collision(sprite1,sprite2);
        expect(result).toEqual("left");               
    });     
    
    

    
    
});

