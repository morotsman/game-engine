function RectangularCollisionStartegy() {
    
    //this.predictive

    this.collision = function (one,two) {
        var sprite1Width = one.getWidthAndHeight().width;
        var sprite1Height = one.getWidthAndHeight().height;
        var sprite1CenterX = one.getPosition().x + sprite1Width / 2;
        var sprite1CenterY = one.getPosition().y + sprite1Height / 2;

        var otherWidth = two.getWidthAndHeight().width;
        var otherHeight = two.getWidthAndHeight().height;
        var otherCenterX = two.getPosition().x + otherWidth / 2;
        var otherCenterY = two.getPosition().y + otherHeight / 2;

        var w = 0.5 * (sprite1Width + otherWidth);
        var h = 0.5 * (sprite1Height + otherHeight);
        var dx = sprite1CenterX - otherCenterX;
        var dy = sprite1CenterY - otherCenterY;
        if (Math.abs(dx) <= w && Math.abs(dy) <= h)
        {
            /* collision! */
            var wy = w * dy;
            var hx = h * dx;
            if (wy > hx) {
                if (wy > -hx) {
                    return "top";
                } else {
                    return "right";
                }
            } else {
                if (wy > -hx) {
                    return "left";
                } else {
                    return "down";
                }
            }

        }
    };
}


