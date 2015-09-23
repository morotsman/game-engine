define(['List'], function (List) {
    
    describe("List", function () {
        
        it("the head of an empty list is undefined", function () {
            var unitUnderTest = new List();
            expect(unitUnderTest.head).toEqual(undefined);
        });  
        
        it("head of [a] is a", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("a");
            expect(unitUnderTest.head.content).toEqual("a");
        });  
        
        it("head.next of [a] is undefined", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("a");
            expect(unitUnderTest.head.next).toEqual(undefined);
        }); 
        
        it("head.prev of [a] is undefined", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("a");
            expect(unitUnderTest.head.prev).toEqual(undefined);
        }); 
        
        it("head of [a,b] is a", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            expect(unitUnderTest.head.content).toEqual("a");
        });  
        
        it("head.next of [a,b] is b", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            expect(unitUnderTest.head.next.content).toEqual("b");
        }); 
        
        it("head.prev of [a,b] is undefined", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            expect(unitUnderTest.head.next.content).toEqual("b");
        });         
        
        it("head.next.prev of [a,b] is a", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            expect(unitUnderTest.head.next.prev.content).toEqual("a");
        });   
        
        it("head.next.next of [a,b] is undefined", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            expect(unitUnderTest.head.next.next).toEqual(undefined);
        });    
        
        it("head of [a,b,c] is a", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("c");
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            expect(unitUnderTest.head.content).toEqual("a");
        }); 
        
        it("head.prev of [a,b,c] is undefined", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("c");
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            expect(unitUnderTest.head.prev).toEqual(undefined);
        }); 
        
        it("head.next of [a,b,c] is b", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("c");
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            expect(unitUnderTest.head.next.content).toEqual("b");
        });    
        
        it("head.next.prev of [a,b,c] is a", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("c");
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            expect(unitUnderTest.head.next.prev.content).toEqual("a");
        });  
        
        it("head.next.next of [a,b,c] is c", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("c");
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            expect(unitUnderTest.head.next.next.content).toEqual("c");
        }); 
        
        it("head.next.next.prev of [a,b,c] is b", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("c");
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            expect(unitUnderTest.head.next.next.prev.content).toEqual("b");
        });   
        
        it("head.next.next.next of [a,b,c] is undefined", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("c");
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            expect(unitUnderTest.head.next.next.next).toEqual(undefined);
        }); 
        
        it("head after delete of undefined in [] is undefined", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("a");
            unitUnderTest.delete(unitUnderTest.head);
            expect(unitUnderTest.head).toEqual(undefined);
        });         
         
        it("head after delete of a in [a] is undefined", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("a");
            unitUnderTest.delete(unitUnderTest.head);
            expect(unitUnderTest.head).toEqual(undefined);
        });  
        
        it("head after delete of a [a,b] is b", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            unitUnderTest.delete(unitUnderTest.head);
            expect(unitUnderTest.head.content).toEqual("b");
        });  

        it("head.next after delete of a [a,b] is b", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            unitUnderTest.delete(unitUnderTest.head);
            expect(unitUnderTest.head.next).toEqual(undefined);
        }); 
        
        it("head.prev after delete of a [a,b] is b", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            unitUnderTest.delete(unitUnderTest.head);
            expect(unitUnderTest.head.prev).toEqual(undefined);
        });          
        
        
        it("head after delete of b [a,b] is a", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            unitUnderTest.delete(unitUnderTest.head.next);
            expect(unitUnderTest.head.content).toEqual("a");
        });        
        
        it("head after delete of b [a,b] is b", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            unitUnderTest.delete(unitUnderTest.head);
            expect(unitUnderTest.head.content).toEqual("b");
        });
        
        it("head after delete of b in [a,b] is a", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            unitUnderTest.delete(unitUnderTest.head.next);
            expect(unitUnderTest.head.content).toEqual("a");
        });  
        
        it("head.next after delete of b in [a,b] is undefined", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            unitUnderTest.delete(unitUnderTest.head.next);
            expect(unitUnderTest.head.next).toEqual(undefined);
        });         
        
        it("head.next after delete of b in [a,b,c] is c", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("c");
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            unitUnderTest.delete(unitUnderTest.head.next);
            expect(unitUnderTest.head.next.content).toEqual("c");
        });    
        
        it("head.next.prev after delete of b in [a,b,c] is a", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("c");
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            unitUnderTest.delete(unitUnderTest.head.next);
            expect(unitUnderTest.head.next.prev.content).toEqual("a");
        });   
        
        it("iterate over [a,b,c,d] results in [a,b,c,d]", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("d");
            unitUnderTest.append("c");
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            var current = unitUnderTest.head;
            var result = [];
            result.push(current.content);
            while(current.next){
                result.push(current.next.content);
                current = current.next;
            }
            expect(result).toEqual(["a","b","c","d"]);
        });  
        
        it("iterate over [a,b,c,d] when c has been deleted results in [a,b,d]", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("d");
            unitUnderTest.append("c");
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            unitUnderTest.delete(unitUnderTest.head.next.next);
            var current = unitUnderTest.head;
            var result = [];
            result.push(current.content);
            while(current.next){
                result.push(current.next.content);
                current = current.next;
            }
            expect(result).toEqual(["a","b","d"]);
        });     
        
       it("iterate over [a,b,c,d] results in [a,b,c,d]", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("d");
            unitUnderTest.append("c");
            unitUnderTest.append("b");
            unitUnderTest.append("a");
            var iterator = unitUnderTest.iterator();
            var result = [];
            while(iterator.hasNext()){
                result.push(iterator.next().content);
            }
            expect(result).toEqual(["a","b","c","d"]);
            
            var newIterator = unitUnderTest.iterator();
            var newResult = [];
            while(newIterator.hasNext()){
                newResult.push(newIterator.next().content);
            }
            expect(newResult).toEqual(["a","b","c","d"]);            
        });  
        
       it("iterate over [] results in []", function () {
            var unitUnderTest = new List();
            var iterator = unitUnderTest.iterator();
            var result = [];
            while(iterator.hasNext()){
                result.push(iterator.next().content);
            }
            expect(result).toEqual([]);
        });  
        
       it("iterate over [a] results in [a]", function () {
            var unitUnderTest = new List();
            unitUnderTest.append("a");
            var iterator = unitUnderTest.iterator();
            var result = [];
            while(iterator.hasNext()){
                result.push(iterator.next().content);
            }
            expect(result).toEqual(["a"]);
        });        
        
        
    });
    
});


