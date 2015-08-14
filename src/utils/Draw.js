var Draw = {};
Draw.drawRect = function(obj, ctx, color) {
    ctx.fillStyle = "black";
    ctx.fillRect(obj.center.x - obj.size.x/2
            , obj.center.y - obj.size.y/2
            , obj.size.x
            , obj.size.y);
}

Draw.drawCircle = function(obj, ctx, color) {
    ctx.fillStyle = color || "#f00";
    ctx.strokeStyle = color || "#f00";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(obj.center.x
            , obj.center.y
            , obj.size.x / 2
            , 0
            , 2 * Math.PI);
    ctx.stroke();
}

module.exports = Draw;
