define(function(require){

    var ScoreBox = function(game, settings) {
        this.getScore = game.scorer.get;
    }
    
    ScoreBox.prototype.draw = function(ctx){
        ctx.font = '30pt Calibri';
        ctx.fillStyle = "black";
        ctx.fillText(this.getScore(), 30, 30);
    };

    return ScoreBox;
});
