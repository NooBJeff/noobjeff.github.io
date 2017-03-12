/**
 * Created by jeff on 2017/3/12.
 */

function AutoSweeper() {

}

AutoSweeper.prototype.readBoard = function (data) {
    console.log("Received", data);
};

var bot = new AutoSweeper();

$(document).ready(function () {
    game.callback = bot.readBoard;
});