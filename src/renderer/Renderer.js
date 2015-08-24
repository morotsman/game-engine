define(["renderer/CanvasRenderer","renderer/WebGLRenderer"], function (CanvasRenderer,WebGLRenderer) {


    function Renderer(canvasId, type) {
        if(type === "canvas"){
            return new CanvasRenderer(canvasId);
        }else if(type === "webGL"){
            return new WebGLRenderer(canvasId);
        }else{
            return undefined;
        }
    };

    return Renderer;


    

});


