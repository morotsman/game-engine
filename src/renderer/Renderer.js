define([], function () {


    function Renderer(canvasId) {
        var canvas = document.getElementById(canvasId);
        var context = canvas.getContext("2d");


        this.height = function () {
            return canvas.height;
        };

        this.width = function () {
            return canvas.width;
        };

        this.clearRect = function () {
            context.clearRect.apply(context, arguments);
        };

        this.save = function () {
            context.save.apply(context, arguments);
        };

        this.restore = function () {
            context.restore.apply(context, arguments);
        };

        this.drawImage = function () {
            context.drawImage.apply(context, arguments);
        };
    }
    ;



    return Renderer;

});


