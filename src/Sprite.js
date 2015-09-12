define(["OffScreenHandlerFactory","Util"], function (offScreenHandlerFactory,util) {

    function Sprite(engine) {

        this.image;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.speedX = 0;
        this.speedY = 0;
        var radius = 0;
        var angle;
        var destroyed = false;

        var that = this;
        var offScreenHandler;

        var keyEvents = {};
        
        var numberOfFrames;
        var spritesPerRow; 
        var spriteWidth;
        var spriteHeight;
        this.currentFrameNumber = 0;
        var animationSpeed = 0;
        this.rotation = 0;
        var spriteX = 0;
        var spriteY = 0;
        this.currentSrc;

        this.getRotation = function(){
            return that.rotation;
        };

        this.getSpritesPerRow = function(){
            return spritesPerRow;
        };
        
        this.getSpriteWidth = function(){
            return spriteWidth;
        };
        
        this.getSpriteHeight = function(){
            return spriteHeight;
        };
        
        this.getCurrentFrameNumber = function(){
            return that.currentFrameNumber;
        };
        
        this.getImage = function(){
            return that.image;
        };
        
        this.getX = function(){
            return that.x;
        };
        
        this.getY = function(){
            return that.y;
        };
        
        this.getWidth = function(){
            return that.width;
        };
        
        this.getHeight = function(){
            return that.height;
        };

        this.getSpriteX = function(){
            return spriteX;
        };
        
        this.getSpriteY = function(){
            return spriteY;
        };        

        this.setImage = function (_image, _numberOfFrames, _spritesPerRow, _spriteWidth, _spriteHeight,_animationSpeed, _spriteX, _spriteY) {
            that.image = document.getElementById(_image);
            numberOfFrames = _numberOfFrames?_numberOfFrames:1;
            spritesPerRow = _spritesPerRow;
            spriteWidth = _spriteWidth;
            spriteHeight = _spriteHeight;
            animationSpeed = _animationSpeed;
            spriteX = _spriteX?_spriteX:0;
            spriteY = _spriteY?_spriteY:0;
            that.currentSrc = that.image.currentSrc;
            return this;
        };



        this.setPosition = function (_x, _y) {
            that.x = _x;
            that.y = _y;
            return this;
        };
        
        this.increaseSpeedX = function (amount) {
            that.speedX = that.speedX + amount;
            return this;
        };

        this.increaseSpeedY = function (amount) {
            that.speedY = that.speedY + amount;
            return this;
        };

        this.setSpeedX = function (_speedX) {
            that.speedX = _speedX;
            return this;
        };

        this.setSpeedY = function (_speedY) {
            that.speedY = _speedY;
            return this;
        };

        this.getSpeedX = function () {
            return that.speedX;
        };

        this.getSpeedY = function () {
            return that.speedY;
        };

        this.setWidthAndHeight = function (_width, _height) {
            that.width = _width;
            that.height = _height;
            radius = that.width > that.height ? that.width / 2 : that.height / 2;
            return this;
        };
        

        this.setAngle = function (_angle) {
            angle = _angle;
            return this;
        };


        this.addForceVector = function (_angle, force) {
            that.speedX = that.speedX + Math.cos(_angle * Math.PI / 180) * force;
            that.speedY = that.speedY + Math.sin(_angle * Math.PI / 180) * force;
        };

        var calulateForce = function (speedX, speedY) {
            return Math.sqrt(Math.pow(speedX, 2) + Math.pow(speedY, 2));
        };
        var calculateAngle = function (speedX, speedY) {
            var angle = Math.atan2(speedY, speedX) * 180 / Math.PI;
            if (angle < 0) {
                angle = 360 + angle;
            }
            return angle;
        };

        this.relativeForceForce = function (other) {
            var relativeX = that.speedX - other.getSpeedX();
            var relativeY = that.speedY - other.getSpeedY();
            return calulateForce(relativeX, relativeY);
        };
        
        this.relativeForceAngle = function (other) {
            var relativeX = that.speedX - other.getSpeedX();
            var relativeY = that.speedY - other.getSpeedY();
            return calculateAngle(relativeX, relativeY);
        };        

        this.relativeSpeedX = function (other) {
            var relativeX = that.speedX - other.getSpeedX();
            return -relativeX;
        };
        
        this.relativeSpeedY = function (other) {
            var relativeY = that.speedY - other.getSpeedY();
            return relativeY;
        };        

        this.getForceVectorForce = function () {
            return calulateForce(that.speedX, that.speedY);
        };
        
        this.getForceVectorAngle = function () {
            return calculateAngle(that.speedX, that.speedY);
        };        

        this.getRadius = function () {
            return radius;
        };

        this.handleUpdate = function () {

        };

        this.handleCollision = function (other) {

        };

        this.handleKeyEvents = function (keyEvents) {

        };

        this.handleDestruction = function () {
            //console.log("handle destruction");
        };

        this.isDestroyed = function () {
            return destroyed;
        };

        this.setDestroyed = function () {
            destroyed = true;
        };


        this.getAngleAndDistance = function (other) {
            var distanceX = other.getX() - that.x;
            var distanceY = other.getY() - that.y;
            var angle = Math.atan2(distanceY, distanceX) * 180 / Math.PI;

            if (angle > 0) {
                angle = 360 - angle;
            } else {
                angle = -angle;
            }

            var distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

            return {
                angle: angle,
                distance: distance

            };
        };

        var prevDraw;
        var drawImage = function (context) {
            if (!that.image) {
                return;
            }

            context.drawImage(that);
           
            var now = new Date().getTime();
            if(!prevDraw || (now-prevDraw)>animationSpeed){
                that.currentFrameNumber++;
                prevDraw = now;
            }
            
            if(that.currentFrameNumber >= numberOfFrames){
               that.currentFrameNumber=0; 
            }
            
        };
        
        this.tick = function(){
            that.x = that.x + that.speedX;
            that.y = that.y - that.speedY;           
        };

        this.draw = function (context) {
            context.save();
            drawImage(context);
            context.restore();
        };

        this.handleOffScreen = function (screenWidth, screenHeight, direction, now) {
            if (offScreenHandler) {
                offScreenHandler(that, screenWidth, screenHeight, direction, now);
                return true;
            }
            return false;
        };

        this.withOffScreenHandler = function (something) {
            if (util.isFunction(something)) {
                offScreenHandler = something;
            } else {
                offScreenHandler = offScreenHandlerFactory.getOffScreenHandler.apply(this, arguments);
            }
            return this;
        };

        engine.addSprite(this);

    }
    ;
    
    return Sprite;


});






