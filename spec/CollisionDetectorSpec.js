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
               
    });
    
    it("should be able to detect that two sprites that almost touch does not collide", function () {  
        //left
        var sprite1 = spriteCreator(10,10,10,10,0,0);
        var sprite2 = spriteCreator(-0.0001,10,10,10,0,0);
        var result = unitUnderTest.collision(sprite1,sprite2);
        expect(result).toEqual(undefined);  
        
         //right
        var sprite1 = spriteCreator(10,10,10,10,0,0);
        var sprite2 = spriteCreator(20.0001,10,10,10,0,0);
        var result = unitUnderTest.collision(sprite1,sprite2);
        expect(result).toEqual(undefined);   
        
        //up
        var sprite1 = spriteCreator(10,10,10,10,0,0);
        var sprite2 = spriteCreator(10,20.0001,10,10,0,0);
        var result = unitUnderTest.collision(sprite1,sprite2);
        expect(result).toEqual(undefined);   
        
        //down
        var sprite1 = spriteCreator(10,10,10,10,0,0);
        var sprite2 = spriteCreator(10,-0.0001,10,10,0,0);
        var result = unitUnderTest.collision(sprite1,sprite2);
        expect(result).toEqual(undefined);               
    });  
    
    it("should be able to detect that two sprites that just touch collides", function () {  

        var sprite1 = spriteCreator(10,10,10,10,0,0);
        var sprite2 = spriteCreator(0,10,10,10,0,0);
        var result = unitUnderTest.collision(sprite1,sprite2);
        expect(result).toEqual("left");  
        
        var sprite1 = spriteCreator(10,10,10,10,0,0);
        var sprite2 = spriteCreator(20,10,10,10,0,0);
        var result = unitUnderTest.collision(sprite1,sprite2);
        expect(result).toEqual("right");   
        
        var sprite1 = spriteCreator(10,10,10,10,0,0);
        var sprite2 = spriteCreator(10,20,10,10,0,0);//y increases towards the bottom of the screen
        var result = unitUnderTest.collision(sprite1,sprite2);
        expect(result).toEqual("down");   
        
        var sprite2 = spriteCreator(10,0,10,10,0,0);//y increases towards the bottom of the screen
        var sprite1 = spriteCreator(10,10,10,10,0,0);
        var result = unitUnderTest.collision(sprite1,sprite2);
        expect(result).toEqual("top");               
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

