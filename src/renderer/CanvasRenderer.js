define([], function () {


    function CanvasRenderer(canvasId) {
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

        this.drawImage = function (sprite) {
            if (!sprite.getSpritesPerRow()) {
                context.drawImage(sprite.getImage(), sprite.getX(), sprite.getY(), sprite.getWidth(), sprite.getHeight());
            } else {
                var row = Math.floor(sprite.getCurrentFrameNumber() / sprite.getSpritesPerRow());
                var sx = sprite.getSpriteX() + sprite.getSpriteWidth() * (sprite.getCurrentFrameNumber() - (row * sprite.getSpritesPerRow()));
                var sy = sprite.getSpriteY() + sprite.getSpriteHeight() * row;
                context.drawImage(sprite.getImage(), sx, sy, sprite.getSpriteWidth(), sprite.getSpriteHeight(), sprite.getX(), sprite.getY(), sprite.getWidth(), sprite.getHeight());
            }

        };

        this.flush = function () {
        }
    }
    ;



    return CanvasRenderer;

});





