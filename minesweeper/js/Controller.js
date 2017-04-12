/**
 * Created by jeff on 2017/3/4.
 */

/*
 Stores the game board
 */
function Game() {
    /**
     * Game 2D
     * @type {Array[]} true if there is a mine
     */
    this.mines = undefined;

    this.column = undefined;
    this.row = undefined;
    this.numMines = undefined;

    /**
     * is current round a new round?
     * @type {boolean}
     */
    this.isNewRound = true;

    this.roundWin = 0;
    this.roundLose = 0;
    this.maxTest = 0;
}

// Callback function to send board info
Game.prototype.bot = undefined;

Game.prototype.reset = function () {
    this.mines = undefined;
    this.column = undefined;
    this.row = undefined;
    this.numMines = undefined;
    this.isNewRound = true;
    this.maxTest = 0;
};

Game.prototype.init = function (x, y, mines) {
    this.column = x;
    this.row = y;
    this.numMines = mines;

    this.mines = create2DArray(this.column, this.row, false);
};

/**
 * Send the game board in 2D array to bot
 * @return {SQUARE_TYPE[][]} game board info
 */
Game.prototype.print = function () {
    return view.squareState;
};

Game.prototype.numMinesNearby = function (pos) {
    var x = pos[0];
    var y = pos[1];
    var lop, lop2;
    var ret = 0;
    for (lop = x - 1; lop <= x + 1; lop++) {
        for (lop2 = y - 1; lop2 <= y + 1; lop2++) {
            if (lop < 0 || lop >= this.column || lop2 < 0 || lop2 >= this.row) {
                continue;
            }
            if ((lop === x) && (lop2 === y)) {
                continue;
            }

            if (this.mines[lop][lop2]) {
                ret += 1;
            }
        }
    }
    return ret;
};

Game.prototype.areAllMinesFlagged = function () {
    var lop, lop2;
    var numUnrevealed = 0;
    for (lop = 0; lop < this.column; lop++) {
        for (lop2 = 0; lop2 < this.row; lop2++) {
            // Is square un-revealed? (One of flagged or un-revealed)
            if (getElementAt(view.squareState, [lop, lop2]) < 0) {
                numUnrevealed += 1;
            }
        }
    }

    return numUnrevealed === this.numMines;
};

Game.prototype.generateMines = function (pos) {
    var lop;
    for (lop = 0; lop < this.numMines; lop++) {
        var x = parseInt(Math.random() * this.column);
        var y = parseInt(Math.random() * this.row);

        if (this.mines[x][y] || (Math.abs(x - pos[0]) <= 1 && Math.abs(y - pos[1]) <= 1)) {
            // Skip if
            // 1. There is a mine already
            // 2. The pos is around the clicked pos
            lop -= 1;
            continue;
        }
        this.mines[x][y] = true;
    }
};

/**
 * Calls after Game Over
 * @param {Boolean} isPlayerWin: Player win or lose?
 * @param {Array} lastPosClicked
 */
Game.prototype.gameOver = function (isPlayerWin, lastPosClicked) {
    // Update Win/Lose info
    isPlayerWin ? this.roundWin += 1 : this.roundLose += 1;
    updateWinLoseInfo(this.roundWin, this.roundLose);

    if ((this.roundWin + this.roundLose) >= this.maxTest) {
        clearInterval(game.jobID);
        game.jobID = undefined;
    }

    view.revealAllSquaresAfterGameOver(isPlayerWin, lastPosClicked);
    clearCallbackFromSquares();

    funcBtnReset();
    funcBtnStart();
};

Game.prototype.runBot = function () {
    var bot = new AutoSweeper();
    if (1) {
        this.jobID = setInterval(
            function (me) {
                return function () {
                    bot.ctrReceiveBoardFromGame(me.print());
                    var result = bot.nextPosToClick();
                    view.click(result[0], result[1]);
                };
            }(this)
        );
    } else {
        while (1) {
            bot.ctrReceiveBoardFromGame(this.print());
            var result = bot.nextPosToClick();
            view.click(result[0], result[1]);
        }
    }
};


var game = new Game();

function funcBtnStart() {
    $("#start_screen").hide();
    $("#game_screen").show();

    var col = parseInt($("#input_column").val());
    var row = parseInt($("#input_row").val());
    var mines = parseInt($("#input_mines").val());

    game.maxTest = parseInt($("#input_max_test").val());
    game.init(row, col, mines);
    view.init(row, col);
}

function funcBtnReset() {
    $("#start_screen").show();
    $("#game_screen").hide();

    game.reset();
    view.reset();
}

$(document).ready(function () {
    // Start Game Button
    $("#btn_start").click(
        function () {
            game.roundWin = 0;
            game.roundLose = 0;
            funcBtnStart();

            game.runBot();
        });

    $("#btn_stop_bot").click(function () {
        clearInterval(game.jobID);
        game.jobID = undefined;
        funcBtnReset();
    });

    // Disable Right Click
    window.oncontextmenu = function () {
        return false;
    };

    $("#game_screen").hide();
});