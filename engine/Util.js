var util = {
    throttled: function (duration, fun) {
        var lastCall;
        var lastResult;
        return function () {
            var now = new Date().getTime();
            if (!lastCall) {
                lastCall = now;
                lastResult = fun.apply(this, arguments);
            } else if ((now - lastCall) > duration) {
                lastCall = now;
                lastResult = fun.apply(this, arguments);
            }
            return lastResult;
        };
    },
    createBufferedOffScreenDetector: function (bufferX, bufferY) {
        return function(screenWidth, screenHeight, sprite, now){
            var position = sprite.getPosition();
            if (position.x < -bufferX) {
                return "left";
            } else if (position.x > screenWidth+bufferX) {
                return "right";
            } else if (position.y < -bufferY) {
                return "top";
            } else if (position.y > screenHeight+bufferY) {
                return "down";
            }
            return undefined;            
        };
    }
};


