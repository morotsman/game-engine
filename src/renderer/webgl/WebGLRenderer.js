define(["renderer/webgl/WebGLUtil","renderer/webgl/ImageRenderer"], function (webGLUtil,imageRenderer) {



    function WebGLRenderer(canvasId) {
        var canvas = document.getElementById(canvasId);
        var gl = webGLUtil.initGL(canvas);
        if (!gl) {
            return;
        }
        
        imageRenderer.init(gl,canvas);
        
        

        this.height = function () {
            return canvas.height;
        };

        this.width = function () {
            return canvas.width;
        };

        this.clearRect = function () {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        };

        this.save = function () {

        };

        this.restore = function () {

        };

        this.drawImage = function () {
            imageRenderer.drawImage.apply(imageRenderer, arguments);         
        };
        
        
        this.flush = function () {
            imageRenderer.flush();
        };
        
        this.loadImage = function (imageInfo) {
            imageRenderer.loadImage(imageInfo);
        };
    }
    ;



    return WebGLRenderer;

});








