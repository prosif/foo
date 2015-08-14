

var Scorer = function(game) {

    var score = 0;

    this.add = function(n) {
        score += n;
    };

    this.get = function() {
        return score;
    };

    this.reset = function() {
        score = 0;
    };
};

module.exports = Scorer;
