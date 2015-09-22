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
         
        
        
        
    });
    
});


