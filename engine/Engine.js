function Engine(canvasId) {

    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");

    var requestId;

    var updateHandler;

    var keyEvents = {};
    document.addEventListener("keydown", function (e) {
        keyEvents[e.keyCode] = e;
    }, true);

    document.addEventListener("keyup", function (e) {
        delete keyEvents[e.keyCode];
    }, true);

    this.registerUpdateHandler = function (fun) {
        updateHandler = fun;
    };

    this.start = function () {
        var runner = function (now) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            var cont = updateHandler(context,now,keyEvents);
            if(cont){
                requestId = requestAnimationFrame(runner);
            }
            
        };


        requestId = requestAnimationFrame(runner);
    };
    



}


