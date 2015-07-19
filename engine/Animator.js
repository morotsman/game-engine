function Animator(_animation, startX ,startY, width, height, columnWidth, rowHeight,animationSpeed){
    
    var animation =  document.getElementById(_animation);
    var x;
    var y;
    
    var theAnimator;
    
    var displayWidth;
    var displayHeight;
    
    var completed = false;
    
    
    this.setPosition = function(_x,_y){
        x = _x;
        y = _y;
    };
    
    this.setWidthAndHeight = function(_width, _height){
        displayWidth = _width;
        displayHeight = _height;        
    };
    
    var createAnimator = function(){
        var switchTime = new Date().getTime();
        var column = 0;
        var row = 0;
        var phase = 0;
        var maxPhase = 16;
        return function(context){
            var now = new Date().getTime();
            
            if(phase > maxPhase){
                completed =  true;
            }
            
            if((now - switchTime > animationSpeed)){
                phase++;
                column = phase%4;
                row = Math.floor(phase/4);
                switchTime = now;
            }
            context.drawImage(animation,startX + columnWidth*column,startY + rowHeight*row,width,height,x,y,displayWidth,displayHeight);
        };
    };   
    
    this.animate = function(context){
        if(theAnimator===undefined){
            theAnimator = createAnimator();
        }
        return theAnimator(context);
    };    
    
    this.isCompleted = function(){
        return completed;
    };
    
}


