/**
 * Control the display on HTML
 * Created by jeff on 2017/3/11.
 */

var SQUARE_TYPE = {
    UNREVEALED: -1,
    FLAGGED: -2
};

/**
 * 存储用户点击的信息
 * @constructor
 */
function View() {
    /**
     *
     * @type {SQUARE_TYPE[][]}
     */
    this.squareState = undefined;
}

View.TEMPLATE_SQUARE = '<div id="%d-%d" class="square"><span>%s</span></div>';
View.SIZE_SQUARE = 30;

View.prototype.init = function (x, y) {
    this.squareState = create2DArray(x, y, SQUARE_TYPE.UNREVEALED);

    this.createBoard(x, y);

    // Set width
    $("#board").width(View.SIZE_SQUARE * y);
};

View.prototype.reset = function () {
    this.squareState = undefined;
    $("#board").empty();
};

View.prototype.createBoard = function (x, y) {
    var lop;
    var lop2;
    for (lop = 0; lop < x; lop++) {
        for (lop2 = 0; lop2 < y; lop2++) {
            $(sprintf(View.TEMPLATE_SQUARE, lop, lop2, '.')).appendTo("#board");
        }
    }

    // Add callbacks
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
 *
 * @param pos
 * @return {number}: -2 if already revealed, -1 if its mine, number if its normal square
 */
View.prototype.reveal = function (pos) {
    if (getElementAt(this.squareState, pos) >= 0) {
        // Already revealed
        return -2;
    }

    if (getElementAt(game.mines, pos)) {
        // Clicked on a mine, game over
        select(pos).text("M");
        select(pos).removeClass().addClass('square bombed');
        return -1;
    }

    // Normal square
    var num = game.numOfNearbyMines(pos);
    this.squareState[pos[0]][pos[1]] = num;

    if (num === 0) {
        select(pos).text('.');
        select(pos).removeClass().addClass("square revealed");
    } else {
        select(pos).text(num);
        select(pos).removeClass().addClass("square numed");
    }

    return num;
};

View.prototype.revealAll = function () {
    var lop, lop2;
    for (lop = 0; lop < game.column; lop++) {
        for (lop2 = 0; lop2 < game.row; lop2++) {
            var pos = [lop, lop2];
            if (getElementAt(game.mines, pos)) {
                select(pos).text("M");
                // Flag correctly
                if (getElementAt(this.squareState, pos) === SQUARE_TYPE.FLAGGED) {
                    select(pos).removeClass().addClass("square flag_correct");
                } else {
                    // You missed this one
                    select(pos).removeClass().addClass("square bomb");
                }
            } else {
                // Not mine and you flag it
                if (getElementAt(this.squareState, pos) === SQUARE_TYPE.FLAGGED) {
                    select(pos).text("X");
                    select(pos).removeClass().addClass("square flag_wrong");
                }
            }
        }
    }
};

View.prototype.startBFS = function (pos) {
    var queue = [pos];

    while (queue.length !== 0) {
        var front = queue.shift();

        if (getElementAt(game.mines, front)) {
            throw new Error("Start BFS on mine" + front);
        }

        var result = this.reveal(front);

        // Only continue the BFS iff result === 0
        // i.e the num of mines nearby is 0
        if (result !== 0) {
            continue;
        }

        // Search for nearby squares to reveal
        var lop, lop2;
        for (lop = front[0] - 1; lop <= front[0] + 1; lop++) {
            for (lop2 = front[1] - 1; lop2 <= front[1] + 1; lop2++) {
                if (lop < 0 || lop >= game.column || lop2 < 0 || lop2 >= game.row) {
                    // Ignore if goes out of boundary
                    continue;
                }
                // Ignore if its already revealed
                if (getElementAt(this.squareState, [lop, lop2]) >= 0) {
                    continue;
                }
                // Ignore if there is a mine
                if (getElementAt(game.mines, front)) {
                    continue;
                }

                queue.push([lop, lop2]);
            }
        }
    }
};

View.prototype.click = function (pos, isLeftClick) {
    if (game.newRound) {
        game.newRound = false;
        game.generateMines(pos);
    }

    // Do nothing if not click on unrevealed squares
    if (getElementAt(this.squareState, pos) !== SQUARE_TYPE.UNREVEALED) {
        return;
    }

    if (isLeftClick) {
        if (getElementAt(game.mines, pos)) {
            // Is bomb
            this.reveal(pos);
            select(pos).removeClass().addClass("square bombed");
            this.youLose();
        } else {
            // Normal un-revealed squares
            this.startBFS(pos);
        }
    } else {
        // Right Click
        if (getElementAt(this.squareState, pos) < 0) {
            // Must not be number squares
            select(pos).toggleClass("flagged");
            if (getElementAt(this.squareState, pos) === SQUARE_TYPE.FLAGGED) {
                this.squareState[pos[0]][pos[1]] = SQUARE_TYPE.UNREVEALED;
            } else {
                this.squareState[pos[0]][pos[1]] = SQUARE_TYPE.FLAGGED;
            }
        }
    }

    if (game.isGameOver()) {
        this.youWin();
    }
};

View.prototype.youWin = function () {
    this.revealAll();

    if (game.bot !== undefined) {
        game.bot.ctrGameOver();
    }

    setTimeout(function () {
        alert("YOU WIN!");
    }, 50);
};

View.prototype.youLose = function () {
    this.revealAll();

    if (game.bot !== undefined) {
        game.bot.ctrGameOver();
    }

    setTimeout(function () {
        alert("YOU LOSE!");
    }, 50);
};

var view = new View();
