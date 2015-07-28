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
    isFunction : function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    } 


};


