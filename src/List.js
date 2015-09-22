define([], function() {

    function List(){
        
        this.head = undefined;
        var that = this;
        
        this.append = function(content){
            var node = {
                next:that.head,
                prev:undefined,
                content:content
            };
            if(that.head){
                that.head.prev = node;
            }
            that.head = node;
            
        };
        
        this.delete = function(node){
            
        };
        
        
    }

    return List;

});


