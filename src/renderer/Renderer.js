define(["renderer/CanvasRenderer"], function (CanvasRenderer) {


    function Renderer(canvasId, type) {
        if(type === "canvas"){
            return new CanvasRenderer(canvasId);
        }else if(type === "webGL"){
            return undefined;
        }else{
            return undefined;
        }
    };

    return Renderer;


    

});


