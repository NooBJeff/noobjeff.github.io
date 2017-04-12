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
    this.newRound = true;
}

// Callback function to send board info
Game.prototype.bot = undefined;

Game.prototype.reset = function () {
    this.mines = undefined;
    this.column = undefined;
    this.row = undefined;
    this.numMines = undefined;
    this.newRound = true;
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
    view.revealAllSquaresAfterGameOver(isPlayerWin, lastPosClicked);
    clearCallbackFromSquares();

    wrapper.gameOver();

    setTimeout(function () {
        alert(isPlayerWin ? "YOU WIN!" : "YOU LOSE!");
    }, 50);
};

//////////
// Event
//////////

Game.prototype.onGameReady = function (funcCode) {
    this.onGameReadyFunc = funcCode;
};

Game.prototype.onGameReadyFunc = defaultFunc;

Game.prototype.onGameOver = function (funcCode) {
    this.onGameOverFunc = funcCode;
};

Game.prototype.onGameOverFunc = defaultFunc;

var game = new Game();

$(document).ready(function () {
    // Start Game Button
    $("#btn_start").click(function () {
        $("#start_screen").hide();
        $("#game_screen").show();

        var col = parseInt($("#input_column").val());
        var row = parseInt($("#input_row").val());
        var mines = parseInt($("#input_mines").val());
        game.init(row, col, mines);
        view.init(row, col);

        wrapper.run();
    });

    // Restart Game Button
    $("#btn_restart").click(function () {
        $("#start_screen").show();
        $("#game_screen").hide();

        game.reset();
        view.reset();

        wrapper.reset();
    });

    // Disable Right Click
    window.oncontextmenu = function () {
        return false;
    };

    $("#game_screen").hide();
});