/**
 * Control the display on HTML
 * Created by jeff on 2017/3/11.
 */

function View() {
    /**
     * [][] -> false: not revealed
     * -> number: number of mines nearby
     * -> 'F': flagged
     * @type {undefined}
     */
    this.revealed = undefined;
}

View.TEMPLATE_SQUARE = '<div id="%d-%d" class="square"><span>%s</span></div>';
View.SIZE_SQUARE = 30;

View.prototype.init = function (x, y) {
    this.revealed = create2DArray(x, y, false);

    this.createBoard(x, y);

    // Set width
    $("#board").width(View.SIZE_SQUARE * y);
};

View.prototype.reset = function () {
    this.revealed = undefined;
    $("#board").empty();
};

View.prototype.createBoard = function (x, y) {
    var lop = 0;
    var lop2 = 0;
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
 * @return {boolean|number}: undefined if already revealed, false if its mine, number if its normal square
 */
View.prototype.reveal = function (pos) {
    if (typeof getElementAt(this.revealed, pos) === "number") {
        // Already revealed
        return false;
    }

    if (getElementAt(game.mines, pos)) {
        // Clicked on a mine, game over
        select(pos).text("M");
        select(pos).removeClass().addClass('square bombed');
        return true;
    }

    // Normal square
    var num = game.numOfNearbyMines(pos);
    this.revealed[pos[0]][pos[1]] = num;

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
                if (getElementAt(this.revealed, pos) === 'F') {
                    select(pos).removeClass().addClass("square flag_correct");
                } else {
                    // You missed this one
                    select(pos).removeClass().addClass("square bomb");
                }
            } else {
                // Not mine and you flag it
                if (getElementAt(this.revealed, pos) === 'F') {
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

        if (result === false || result !== 0) {
            // End of BFS
            continue;
        }

        var lop, lop2;
        for (lop = front[0] - 1; lop <= front[0] + 1; lop++) {
            for (lop2 = front[1] - 1; lop2 <= front[1] + 1; lop2++) {
                if (lop < 0 || lop >= game.column || lop2 < 0 || lop2 >= game.row) {
                    continue;
                }
                // Already revealed
                if (this.revealed[lop][lop2] !== false) {
                    continue;
                }
                // Is mine
                if (getElementAt(game.mines, front)) {
                    continue;
                }
                queue.push([lop, lop2]);
            }
        }
    }
};

View.prototype.click = function (pos, isLeftClick) {
    if (game.firstClick) {
        game.firstClick = false;
        game.generateMines(pos);
    }

    if (isLeftClick) {
        if (getElementAt(game.mines, pos)) {
            this.reveal(pos);
            select(pos).removeClass().addClass("square bombed");
            this.youLose();
        } else {
            this.startBFS(pos);
        }
    } else {
        // Right Click
        if (typeof getElementAt(this.revealed, pos) !== "number") {
            select(pos).toggleClass("flagged");
            if (getElementAt(this.revealed, pos) === 'F') {
                this.revealed[pos[0]][pos[1]] = false;
            } else {
                this.revealed[pos[0]][pos[1]] = 'F';
            }
        }
    }

    game.print();

    if (game.isGameOver()) {
        this.youWin();
    }
};

View.prototype.youWin = function () {
    this.revealAll();

    setTimeout(function () {
        alert("YOU WIN!");
    }, 200);
};

View.prototype.youLose = function () {
    this.revealAll();

    setTimeout(function () {
        alert("YOU LOSE!");
    }, 200);
};

var view = new View();
