define([], function () {

    function Animator(_animation, sourceX, sourceY, sourceImageWidth, sourceImageHeight, columnWidth, rowHeight, animationSpeed, numberOfPhases, columns) {

        var animation = document.getElementById(_animation);
        var x;
        var y;

        var theAnimator;

        var displayWidth;
        var displayHeight;

        var completed = false;


        this.setPosition = function (_x, _y) {
            x = _x;
            y = _y;
        };

        this.setWidthAndHeight = function (_width, _height) {
            displayWidth = _width;
            displayHeight = _height;
        };

        var createAnimator = function () {
            var switchTime = new Date().getTime();
            var column = 0;
            var row = 0;
            var phase = 0;
            return function (context) {
                var now = new Date().getTime();

                if (phase > numberOfPhases) {
                    completed = true;
                }

                if ((now - switchTime > animationSpeed)) {
                    phase++;
                    column = phase % columns;
                    row = Math.floor(phase / columns);
                    switchTime = now;
                }
                context.drawImage(animation, sourceX + columnWidth * column, sourceY + rowHeight * row, sourceImageWidth, sourceImageHeight, x, y, displayWidth, displayHeight);
            };
        };

        this.animate = function (context) {
            if (theAnimator === undefined) {
                theAnimator = createAnimator();
            }
            return theAnimator(context);
        };

        this.isCompleted = function () {
            return completed;
        };

    }

    return Animator;
});





