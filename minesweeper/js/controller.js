/**
 * Created by jeff on 2017/3/4.
 */

/*
 ME
 FE

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

    this.firstClick = true;
}

// Callback function to send board info
Game.prototype.callback = function (data) {
    console.log(data);
};

Game.prototype.reset = function () {
    this.mines = undefined;
    this.column = undefined;
    this.row = undefined;
    this.numMines = undefined;
    this.firstClick = true;
};

Game.prototype.init = function (x, y, mines) {
    this.column = x;
    this.row = y;
    this.numMines = mines;

    this.mines = create2DArray(this.column, this.row, false);
};

// todo
Game.prototype.print = function () {
    var ret = create2DArray(this.column, this.row, 0);

    var lop, lop2;
    for (lop = 0; lop < this.column; lop++) {
        for (lop2 = 0; lop2 < this.row; lop2++) {
            var pos = [lop, lop2];
            if (typeof getElementAt(view.revealed, pos) === "number") {
                // Revealed
                ret[lop][lop2] = getElementAt(view.revealed, pos);
            } else {
                // Not revealed
                ret[lop][lop2] = 'X';
            }
        }
    }

    this.callback(ret);
};

Game.prototype.numOfNearbyMines = function (pos) {
    var x = pos[0];
    var y = pos[1];
    var lop, lop2;
    var ret = 0;
    for (lop = x - 1; lop <= x + 1; lop++) {
        for (lop2 = y - 1; lop2 <= y + 1; lop2++) {
            if ((lop === x) && (lop2 === y)) {
                continue;
            }
            if (lop < 0 || lop >= this.column || lop2 < 0 || lop2 >= this.row) {
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
            if (typeof view.revealed[lop][lop2] !== "number") {
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
    });

    window.oncontextmenu = function () {
        return false;
    };

    $("#game_screen").hide();
});