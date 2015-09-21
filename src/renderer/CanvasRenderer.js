define([], function () {


    function CanvasRenderer(canvasId) {
        var canvas = document.getElementById(canvasId);
        var context = canvas.getContext("2d");

        var imageCache = {};


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
            context.save();
            var imageInfo = imageCache[sprite.currentSrc];

            if (imageInfo.numberOfFrames===1) {
                context.drawImage(imageInfo.image, sprite.x, sprite.y, sprite.width, sprite.height);
            } else {
                var row = Math.floor(sprite.currentFrameNumber / imageInfo.spritesPerRow);
                var sx = imageInfo.spriteX + imageInfo.spriteWidth * (sprite.currentFrameNumber - (row * imageInfo.spritesPerRow));
                var sy = imageInfo.spriteY + imageInfo.spriteHeight * row;
                context.drawImage(imageInfo.image, sx, sy, imageInfo.spriteWidth, imageInfo.spriteHeight, sprite.x, sprite.y, sprite.width, sprite.height);

                if (imageInfo.numberOfFrames > 1) {
                    sprite.currentFrameNumber = sprite.frameNumber % imageInfo.numberOfFrames;
                    sprite.counter++;
                    if (sprite.counter % imageInfo.animationSpeed === 0) {
                        sprite.frameNumber++;
                    }

                }
            }
            context.restore();

        };

        this.flush = function () {
        };

        this.loadImage = function (imageInfo) {
            imageCache[imageInfo.key] = imageInfo;
        };
    }
    ;



    return CanvasRenderer;

});





