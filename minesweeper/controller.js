/**
 * Created by jeff on 2017/3/4.
 */

/*
 ME
 FE

 */

var sizeSquare = 30;
var template = '<div id="%d-%d" class="square"><span>%s</span></div>';

/**
 *
 * @param {number[]} pos
 * @return {*|jQuery|HTMLElement}
 */
function select(pos) {
    return $(sprintf("#%d-%d", pos[0], pos[1]));
}

function Board() {
    /**
     * Board 2D
     * @type {Array[]}
     */
    this.board = undefined;
    this.revealed = undefined;

    this.column = undefined;
    this.row = undefined;
    this.numMines = undefined;

    this.firstClick = true;
}

Board.prototype.reset = function () {
    this.board = undefined;
    this.revealed = undefined;
    this.column = undefined;
    this.row = undefined;
    this.numMines = undefined;
    this.firstClick = true;

    $("#board").empty();
};

Board.prototype.init = function (x, y, mines) {
    this.column = x;
    this.row = y;
    this.numMines = mines;

    this.board = new Array(this.column);
    this.revealed = new Array(this.column);

    var lop = 0;
    for (lop = 0; lop < this.column; lop++) {
        /**
         *
         * @type {Array}
         */
        this.board[lop] = new Array(this.row);
        this.board[lop].fill('E');

        this.revealed[lop] = new Array(this.row);
        this.revealed[lop].fill(false);
    }

    var lop2 = 0;
    for (lop = 0; lop < this.column; lop++) {
        for (lop2 = 0; lop2 < this.row; lop2++) {
            $(sprintf(template, lop, lop2, '.')).appendTo("#board");
        }
    }

    // Set width
    $("#board").width(sizeSquare * this.row);

    // Add callback
    $(".square").click(function (me) {
        return function () {
            var strPos = $(this)[0].id.split('-');
            strPos = [parseInt(strPos[0]), parseInt(strPos[1])];

            if ($("#isRightClick")[0].checked) {
                me.click(strPos, false);
            } else {
                me.click(strPos, true);
            }
        };
    }(this));
};

/**
 * -1: already revealed
 * 0: Empty
 * 1: Mine
 * @param {number[]} pos
 * @return {number}
 */
Board.prototype.reveal = function (pos) {
    if (this.revealed[pos[0]][pos[1]]) {
        return -1;
    }

    this.revealed[pos[0]][pos[1]] = true;
    select(pos).removeClass("flagged");
    select(pos).addClass("revealed");

    if (this.board[pos[0]][pos[1]] === 'E') {
        select(pos).text('.');
        return 0;
    } else {
        select(pos).text('GG');
        select(pos).addClass('bombed');
        return 1;
    }
};

Board.prototype.numOfNearbyMines = function (pos) {
    var x = pos[0];
    var y = pos[1];
    var lop, lop2;
    var ret = 0;
    for (lop = x - 1; lop <= x + 1; lop++) {
        for (lop2 = y - 1; lop2 <= y + 1; lop2++) {
            if (lop < 0 || lop >= this.column || lop2 < 0 || lop2 >= this.row) {
                continue;
            }
            if (this.board[lop][lop2] === 'M') {
                ret += 1;
            }
        }
    }
    return ret;
};

Board.prototype.startBFS = function (pos) {
    var queue = [pos];

    while (queue.length !== 0) {
        var front = queue.shift();

        switch (this.reveal(front)) {
            case -1:
                break;
            case 0:
                // Empty
                var num = this.numOfNearbyMines(front);
                if (num !== 0) {
                    select(front).text(num);
                    select(front).addClass('numed');
                } else {
                    var lop, lop2;
                    for (lop = front[0] - 1; lop <= front[0] + 1; lop++) {
                        for (lop2 = front[1] - 1; lop2 <= front[1] + 1; lop2++) {
                            if (lop < 0 || lop >= this.column || lop2 < 0 || lop2 >= this.row) {
                                continue;
                            }
                            if (this.revealed[lop][lop2]) {
                                continue;
                            }
                            if (this.board[lop][lop2] === 'M') {
                                continue;
                            }
                            queue.push([lop, lop2]);
                        }
                    }
                }
                break;
            case 1:
                // Is Mine
                break;
        }

    }
};

Board.prototype.isGameOver = function () {
    var lop, lop2;
    var numUnrevealed = 0;
    for (lop = 0; lop < this.column; lop++) {
        for (lop2 = 0; lop2 < this.row; lop2++) {
            if (!this.revealed[lop][lop2]) {
                numUnrevealed += 1;
            }
        }
    }

    return numUnrevealed === this.numMines;
};

Board.prototype.click = function (pos, isLeftClick) {
    if (this.firstClick) {
        this.firstClick = false;
        this.generateMines(pos);
    }

    if (isLeftClick) {
        if (this.board[pos[0]][pos[1]] === "M") {
            this.reveal(pos);
            this.youLose();
        } else {
            this.startBFS(pos);
        }
    } else {
        // Right Click
        if (!this.revealed[pos[0]][pos[1]]) {
            select(pos).toggleClass("flagged");
        }
    }

    if (this.isGameOver()) {
        this.youWin();
    }
    // Send data
};

Board.prototype.youWin = function () {
    alert("YOU WIN!");

    var lop, lop2;
    for (lop = 0; lop < this.column; lop++) {
        for (lop2 = 0; lop2 < this.row; lop2++) {
            if (!this.revealed[lop][lop2]) {
                this.reveal([lop, lop2]);
            }
        }
    }
};

Board.prototype.youLose = function () {
    alert("You LOSE");
};

Board.prototype.generateMines = function (pos) {
    var lop;
    for (lop = 0; lop < this.numMines; lop++) {
        var x = parseInt(Math.random() * this.column);
        var y = parseInt(Math.random() * this.row);

        if (this.board[x][y] === 'M' || (x === pos[0] && y === pos[1])) {
            lop -= 1;
        } else {
            this.board[x][y] = 'M';
        }
    }
};

$(document).ready(function () {
    $("#btn_start").click(function () {
        $("#start_screen").hide();
        $("#game_screen").show();

        var col = parseInt($("#input_column").val());
        var row = parseInt($("#input_row").val());
        var mines = parseInt($("#input_mines").val());
        board.init(col, row, mines);
    });

    $("#btn_restart").click(function () {
        $("#start_screen").show();
        $("#game_screen").hide();

        board.reset();
    });

    window.oncontextmenu = function () {
        return false;
    };

    $("#game_screen").hide();
    var board = new Board();
});