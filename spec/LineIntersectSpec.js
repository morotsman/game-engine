define(['line-intersect'], function (unitUnderTest) {

    describe("Line intersection detector", function () {

        //var unitUnderTest = new LineIntersect();

        it("should be able to detect that two horizontal lines are parallel", function () {
            var p1 = {
                x: 0,
                y: 0
            };
            var p2 = {
                x: 10,
                y: 0
            };
            var q1 = {
                x: 0,
                y: 2
            };
            var q2 = {
                x: 10,
                y: 2
            };
            var result = unitUnderTest.getLineSegmentsIntersect(p1, p2, q1, q2);
            expect(result).toEqual(Number.MAX_VALUE);
        });

        it("should be able to detect that two vertical lines are parallel", function () {
            var p1 = {
                x: 0,
                y: 0
            };
            var p2 = {
                x: 0,
                y: 10
            };
            var q1 = {
                x: 2,
                y: 0
            };
            var q2 = {
                x: 2,
                y: 10
            };
            var result = unitUnderTest.getLineSegmentsIntersect(p1, p2, q1, q2);
            expect(result).toEqual(Number.MAX_VALUE);
        });

        it("should not give false positive", function () {
            var p1 = {
                x: 0,
                y: 0
            };
            var p2 = {
                x: 2,
                y: 0
            };
            var q1 = {
                x: 2.1,
                y: -1
            };
            var q2 = {
                x: 2.1,
                y: 2
            };
            var result = unitUnderTest.getLineSegmentsIntersect(p1, p2, q1, q2);
            expect(result).toEqual(Number.MAX_VALUE);
        });

        it("should not give false positive", function () {
            var p1 = {
                x: 0,
                y: 0
            };
            var p2 = {
                x: 2,
                y: 0
            };
            var q1 = {
                x: -0.1,
                y: -1
            };
            var q2 = {
                x: -0.1,
                y: 2
            };
            var result = unitUnderTest.getLineSegmentsIntersect(p1, p2, q1, q2);
            expect(result).toEqual(Number.MAX_VALUE);
        });

        it("should be able to detect the intersect of two crossing lines", function () {
            var p1 = {
                x: 0,
                y: 0
            };
            var p2 = {
                x: 10,
                y: 0
            };

            for (var i = 0; i < 11; i++) {
                var q1 = {
                    x: i,
                    y: -5
                };
                var q2 = {
                    x: i,
                    y: 5
                };
                var result = unitUnderTest.getLineSegmentsIntersect(p1, p2, q1, q2);
                expect(result * 10).toEqual(i);
            }
        });

    });

});




