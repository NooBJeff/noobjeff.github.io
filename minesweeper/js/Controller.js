/**
 * Created by jeff on 2017/3/4.
 */

/*
 Stores the game board
 */
function Game() {
    /**
     * Game 2D
     * @type {Array[]}
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

// Callback function to send boardRecv info
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
 * @return {Array} game board info
 */
Game.prototype.print = function () {
    var ret = create2DArray(this.column, this.row, 0);

    var lop, lop2;
    for (lop = 0; lop < this.column; lop++) {
        for (lop2 = 0; lop2 < this.row; lop2++) {
            var pos = [lop, lop2];
            if (getElementAt(view.squareState, pos) >= 0) {
                // Revealed
                ret[lop][lop2] = getElementAt(view.squareState, pos);
            } else {
                // Not revealed
                ret[lop][lop2] = 'X';
            }
        }
    }

    return ret;
};

Game.prototype.numOfNearbyMines = function (pos) {
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

Game.prototype.isGameOver = function () {
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

        if (this.mines[x][y] || (x === pos[0] && y === pos[1])) {
            lop -= 1;
        } else {
            this.mines[x][y] = true;
        }
    }
};

var game = new Game();

$(document).ready(function () {
    $("#btn_start").click(function () {
        $("#start_screen").hide();
        $("#game_screen").show();

        var col = parseInt($("#input_column").val());
        var row = parseInt($("#input_row").val());
        var mines = parseInt($("#input_mines").val());
        game.init(col, row, mines);
        view.init(col, row);
    });

    $("#btn_restart").click(function () {
        $("#start_screen").show();
        $("#game_screen").hide();

        game.reset();
        view.reset();

        if (game.bot !== undefined) {
            game.bot.ctrReset();
        }
    });

    window.oncontextmenu = function () {
        return false;
    };

    $("#game_screen").hide();
});