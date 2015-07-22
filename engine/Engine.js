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
            var cont = updateHandler(context, now, keyEvents);
            if (cont) {
                requestId = requestAnimationFrame(runner);
            }

        };


        requestId = requestAnimationFrame(runner);
    };

    this.detectCollisions = function (sprites) {
        for (var i1 = 0; i1 < sprites.length; i1++) {
            for (var i2 = i1; i2 < sprites.length; i2++) {
                if (sprites[i1].collision(sprites[i2]) && i1 !== i2) {
                    sprites[i1].handleCollision(sprites[i2]);
                    sprites[i2].handleCollision(sprites[i1]);
                }
            }
        }
    };




}


