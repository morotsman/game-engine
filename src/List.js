define([], function () {

    function Iterator(head) {
        var current = head;

        this.next = function () {
            var result = current;
            current = current.next;
            return result;
        };

        this.hasNext = function () {
            return current !== undefined;
        };
    }
    ;

    function List() {

        this.head = undefined;
        var that = this;

        this.append = function (content) {
            var node = {
                next: that.head,
                prev: undefined,
                content: content
            };
            if (that.head) {
                that.head.prev = node;
            }
            that.head = node;

        };

        this.delete = function (node) {
            if (node.prev === undefined) {//remove head of list
                if (node.next) {
                    node.next.prev = undefined;
                    that.head = node.next;
                } else {
                    that.head = undefined;
                }
            } else if (node.next === undefined) {//remove end of list
                if (node.prev) {
                    node.prev.next = undefined;
                }
            } else {//remove in the middle of the list
                node.next.prev = node.prev;
                node.prev.next = node.next;
                node.next = undefined;
                node.prev = undefined;
            }
        };

        this.iterator = function(){
            return new Iterator(that.head);
        } 
    };

    return List;

});


