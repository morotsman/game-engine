define(["line-intersect"], function (lineIntersect) {

    function RectangularCollisionStartegy() {

        var minkowskiDifference = function (one, two) {
            return {
                left: one.x - two.maxX,
                top: one.y - two.maxY,
                width: one.width + two.width,
                height: one.height + two.height
            };
        };
        var detectSide = function (md) {
            var direction = "left";
            var minDist = Math.abs(md.left);
            if (Math.abs(md.left + md.width) < minDist)//a cornercase here: the minDistance could be equal if something that has the width of one pixel hits a corner. 
            {
                minDist = Math.abs(md.left + md.width);
                direction = "right";
            }
            if (Math.abs(md.top + md.height) < minDist)
            {
                minDist = Math.abs(md.top + md.height);
                direction = "down";
            }
            if (Math.abs(md.top) < minDist)
            {
                direction = "top";
            }
            return direction;
        };


        var getIntersectionFraction = function (md, relativeSpeed) {
            var origin = {
                x: 0,
                y: 0
            };
            var endPoint = relativeSpeed;

            var minY = md.top;
            var maxY = md.top + md.height;
            var minX = md.left;
            var maxX = md.left + md.width;

            // for each of the AABB's four edges
            // calculate the minimum fraction of "direction"
            // in order to find where the ray FIRST intersects
            // the AABB (if it ever does)   
            var minT = lineIntersect.getLineSegmentsIntersect(origin, endPoint, {x: minX, y: minY}, {x: minX, y: maxY});//topLeft to bottomLeft
            var x;
            x = lineIntersect.getLineSegmentsIntersect(origin, endPoint, {x: minX, y: maxY}, {x: maxX, y: maxY});//bottomLeft to bottomRight
            if (x < minT)
                minT = x;
            x = lineIntersect.getLineSegmentsIntersect(origin, endPoint, {x: maxX, y: maxY}, {x: maxX, y: minY});//bottomRight to topRight
            if (x < minT)
                minT = x;
            x = lineIntersect.getLineSegmentsIntersect(origin, endPoint, {x: maxX, y: minY}, {x: minX, y: minY});//topRight to topLeft
            if (x < minT)
                minT = x;
            // ok, now we should have found the fractional component along the ray where we collided
            return minT;
        };

        var spriteToAABB = function (sprite) {
            return {
                x: sprite.x,
                y: sprite.y,
                maxX: sprite.x + sprite.width,
                maxY: sprite.y + sprite.height,
                width: sprite.width,
                height: sprite.height
            };
        };

        var relativeSpeed = function (one, two) {
            var relativeX = one.speedX - two.speedX;
            var relativeY = one.speedY - two.speedY;
            return {
                x: -relativeX,
                y: relativeY
            };
        };

        this.collision = function (sprite1, sprite2) {
            var one = spriteToAABB(sprite1);
            var two = spriteToAABB(sprite2);
            var md = minkowskiDifference(one, two);
            if (md.left <= 0 && md.left + md.width >= 0
                    && md.top <= 0 && md.top + md.height >= 0) {
                return detectSide(md);
            } else {
                var rSpeed = relativeSpeed(sprite1, sprite2);
                var h = getIntersectionFraction(md, rSpeed);
                if (h !== Number.MAX_VALUE) {
                    one.x = one.x + sprite1.speedX * h;
                    one.maxX = one.x + one.width;
                    one.y = one.y - sprite1.speedY * h;
                    one.maxY = one.y + one.height;
                    two.x = two.x + sprite2.speedX * h;
                    two.maxX = two.x + two.width;
                    two.y = two.y - sprite2.speedY * h;
                    two.maxY = two.y + two.height;
                    var md = minkowskiDifference(one, two);
                    if (md.left <= 0 && md.left + md.width >= 0
                            && md.top <= 0 && md.top + md.height >= 0) {
                        return detectSide(md);
                    }
                }



            }


        };
    };

    return new RectangularCollisionStartegy();
});




