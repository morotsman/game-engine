define(["OffScreenHandlerFactory","Util"], function (offScreenHandlerFactory,util) {

    function Sprite(engine) {

        var image;
        var x = 0;
        var y = 0;
        var width = 0;
        var height = 0;
        var speedX = 0;
        var speedY = 0;
        var radius = 0;
        var animation;
        var angle;
        var destroyed = false;

        var that = this;
        var offScreenHandler;

        var keyEvents = {};
        
        var numberOfFrames;
        var spritesPerRow; 
        var spriteWidth;
        var spriteHeight;
        var currentFrameNumber = 0;
        var animationSpeed = 0;
        var animationCycle = 0;
        var rotation = 0;
        var spriteX = 0;
        var spriteY = 0;

        this.getRotation = function(){
            return rotation;
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
            return currentFrameNumber;
        };
        
        this.getImage = function(){
            return image;
        };
        
        this.getX = function(){
            return x;
        };
        
        this.getY = function(){
            return y;
        };
        
        this.getWidth = function(){
            return width;
        };
        
        this.getHeight = function(){
            return height;
        };

        this.getSpriteX = function(){
            return spriteX;
        };
        
        this.getSpriteY = function(){
            return spriteY;
        };        

        this.setImage = function (_image, _numberOfFrames, _spritesPerRow, _spriteWidth, _spriteHeight,_animationSpeed, _spriteX, _spriteY) {
            image = document.getElementById(_image);
            numberOfFrames = _numberOfFrames?_numberOfFrames:1;
            spritesPerRow = _spritesPerRow;
            spriteWidth = _spriteWidth;
            spriteHeight = _spriteHeight;
            animationSpeed = _animationSpeed;
            spriteX = _spriteX?_spriteX:0;
            spriteY = _spriteY?_spriteY:0;
            return this;
        };



        this.setPosition = function (_x, _y) {
            x = _x;
            y = _y;
            return this;
        };
/*
        this.getPosition = function () {
            return {
                x: x,
                y: y
            };
        };
*/
        this.increaseSpeedX = function (amount) {
            speedX = speedX + amount;
            return this;
        };

        this.increaseSpeedY = function (amount) {
            speedY = speedY + amount;
            return this;
        };

        this.setSpeedX = function (_speedX) {
            speedX = _speedX;
            return this;
        };

        this.setSpeedY = function (_speedY) {
            speedY = _speedY;
            return this;
        };

        this.getSpeedX = function () {
            return speedX;
        };

        this.getSpeedY = function () {
            return speedY;
        };

        this.setWidthAndHeight = function (_width, _height) {
            width = _width;
            height = _height;
            radius = width > height ? width / 2 : height / 2;
            return this;
        };
        

        this.setAngle = function (_angle) {
            angle = _angle;
            return this;
        };


        this.addForceVector = function (_angle, force) {
            speedX = speedX + Math.cos(_angle * Math.PI / 180) * force;
            speedY = speedY + Math.sin(_angle * Math.PI / 180) * force;
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

        this.relativeForce = function (other) {
            var relativeX = speedX - other.getSpeedX();
            var relativeY = speedY - other.getSpeedY();
            return {
                force: calulateForce(relativeX, relativeY),
                angle: calculateAngle(relativeX, relativeY)
            };
        };

        this.relativeSpeed = function (other) {
            var relativeX = speedX - other.getSpeedX();
            var relativeY = speedY - other.getSpeedY();
            return {
                x: -relativeX,
                y: relativeY
            };
        };

        this.getForceVector = function () {
            return {
                force: calulateForce(speedX, speedY),
                angle: calculateAngle(speedX, speedY)
            };
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
            var distanceX = other.getX() - x;
            var distanceY = other.getY() - y;
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
            if (!image) {
                return;
            }

            context.drawImage(that);
           
            var now = new Date().getTime();
            if(!prevDraw || (now-prevDraw)>animationSpeed){
                currentFrameNumber++;
                prevDraw = now;
            }
            
            if(currentFrameNumber >= numberOfFrames){
               currentFrameNumber=0; 
               animationCycle++;
            }
        };
        
        this.getAnimationCycle = function(){
            return animationCycle;
        };

        var animate = function (context) {
            animation.setPosition(x, y);
            animation.setWidthAndHeight(width, height);
            return animation.animate(context);
        };
        
        this.tick = function(){
            x = x + speedX;
            y = y - speedY;           
        };

        this.draw = function (context) {
            context.save();
            if (animation) {
                animate(context);
            } else {
                drawImage(context);
            }
            context.restore();
        };

        this.animationCompleted = function () {
            return animation.isCompleted();
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






