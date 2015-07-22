function Sprite() {

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

    var keyEvents = {};




    this.setImage = function (_image) {
        image = document.getElementById(_image);
        return this;
    };



    this.setPosition = function (_x, _y) {
        x = _x;
        y = _y;
        return this;
    };

    this.getPosition = function () {
        return {
            x: x,
            y: y
        };
    };

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
    
    this.getForceVector = function(){
        var force = Math.sqrt(Math.pow(speedX,2) + Math.pow(speedY,2));
        //var angle = Math.tan(speedY/speedX) * 180 / Math.PI;
        
        var angle = Math.atan2(speedY, speedX) * 180 / Math.PI;


        if (angle < 0) {
            angle = 360 + angle;
        }      
        
        return {
            force: force,
            angle: angle
        };
    };

    this.getRadius = function () {
        return radius;
    };

    this.collision = function (other) {
        var dx = (x + radius) - (other.getPosition().x + other.getRadius());
        var dy = (y + radius) - (other.getPosition().y + other.getRadius());
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius + other.getRadius()) {
            return true;
        } else {
            return false;
        }

    };
    
    this.handleCollision = function(other){
        
    };


    this.getAngleAndDistance = function (other) {
        var otherPosition = other.getPosition();
        var distanceX = otherPosition.x - x;
        var distanceY = otherPosition.y - y;
        var angle = Math.atan2(distanceY, distanceX) * 180 / Math.PI;

        if (angle > 0) {
            angle = 360 - angle;
        } else {
            angle = -angle;
        }
        
        var distance = Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY,2));
        
        return {
            angle: angle,
            distance: distance

        };
    };

    var drawImage = function (context) {
        x = x + speedX;
        y = y - speedY;

        if (width && height) {
            context.drawImage(image, x, y, width, height);
        } else if (width && !height) {
            context.drawImage(image, x, y, width);
        } else if (height) {
            context.drawImage(image, x, y, width, height);
        } else {
            context.drawImage(image, x, y);
        }
    };

    var animate = function (context) {
        x = x + speedX;
        y = y - speedY;
        animation.setPosition(x, y);
        animation.setWidthAndHeight(width, height);
        return animation.animate(context);
    };

    this.draw = function (context) {
        context.save();
        if (animation) {
            animate(context);
        } else {
            drawImage(context);
        }
        drawCircle(context);
        context.restore();
    };

    this.animationCompleted = function () {
        return animation.isCompleted();
    };


    this.setAnimation = function (_animation, startX, startY, width, height, columnWidth, rowHeight, animationSpeed, numberOfPhases) {
        animation = new Animator(_animation, startX, startY, width, height, columnWidth, rowHeight, animationSpeed,numberOfPhases);
        return this;
    };



    var drawCircle = function (ctx) {
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }



}
;



