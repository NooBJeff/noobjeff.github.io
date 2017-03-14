/**
 * Created by jeff on 2017/3/12.
 */

function AutoSweeper() {
    this.boardRecv = undefined;

    /**
     * 1: mine
     * @type {undefined}
     */
    this.board = undefined;
    this.x = undefined;
    this.y = undefined;
    this.firstClick = true;

    this.arrClickPos = [];
}


AutoSweeper.prototype.reset = function () {
    this.boardRecv = undefined;

    this.board = undefined;
    this.x = undefined;
    this.y = undefined;
    this.firstClick = true;

    this.arrClickPos = [];
};


AutoSweeper.prototype.readBoard = function (data) {
    this.boardRecv = data;

    if (this.board === undefined) {
        this.x = data.length;
        this.y = data[0].length;
        this.board = create2DArray(this.x, this.y, false);
    }

    // var lop, lop2;
    // for (lop = 0; lop < this.x; lop++) {
    //     for (lop2 = 0; lop2 < this.y; lop2++) {
    //         if (this.board[lop][lop2] === 1) {
    //             continue;
    //         }
    //         if (this.boardRecv[lop][lop2] !== "x") {
    //             // Numbers
    //             this.board[lop][lop2] = 0;
    //         }
    //     }
    // }

    this.clickNext();
};

AutoSweeper.prototype.arrUnrevealedNearby = function (pos) {
    var ret = [];
    var lop, lop2;
    for (lop = pos[0] - 1; lop <= pos[0] + 1; lop++) {
        for (lop2 = pos[1] - 1; lop2 <= pos[1] + 1; lop2++) {
            if (lop < 0 || lop >= this.x || lop2 < 0 || lop2 >= this.y) {
                continue;
            }
            if ((lop === pos[0]) && (lop2 === pos[1])) {
                continue;
            }

            if (this.boardRecv[lop][lop2] === 'X') {
                if (!contains(ret, [lop, lop2])) {
                    ret.push([lop, lop2]);
                }
            }
        }
    }

    return ret;
};

AutoSweeper.prototype.arrSafePos = function (pos) {
    var ret = [];
    var lop, lop2;
    for (lop = pos[0] - 1; lop <= pos[0] + 1; lop++) {
        for (lop2 = pos[1] - 1; lop2 <= pos[1] + 1; lop2++) {
            if (lop < 0 || lop >= this.x || lop2 < 0 || lop2 >= this.y) {
                continue;
            }
            if ((lop === pos[0]) && (lop2 === pos[1])) {
                continue;
            }

            if (this.boardRecv[lop][lop2] === 'X' && this.board[lop][lop2] !== 1) {
                if (!contains(ret, [lop, lop2])) {
                    ret.push([lop, lop2]);
                }
            }
        }
    }

    return ret;
};

AutoSweeper.prototype.numMinesNearBy = function (pos) {
    var ret = 0;
    var lop, lop2;
    for (lop = pos[0] - 1; lop <= pos[0] + 1; lop++) {
        for (lop2 = pos[1] - 1; lop2 <= pos[1] + 1; lop2++) {
            if (lop < 0 || lop >= this.x || lop2 < 0 || lop2 >= this.y) {
                continue;
            }
            if ((lop === pos[0]) && (lop2 === pos[1])) {
                continue;
            }

            if (this.board[lop][lop2] === 1) {
                ret += 1;
            }
        }
    }

    return ret;
};

// Flag these squares found
AutoSweeper.prototype.findMinePos = function () {
    var lop, lop2;
    for (lop = 0; lop < this.x; lop++) {
        for (lop2 = 0; lop2 < this.y; lop2++) {
            if (this.boardRecv[lop][lop2] === 0 || this.boardRecv[lop][lop2] === 'X') {
                // Not revealed or no mines nearby
                continue;
            }

            // Find  un-revealed space nearby
            var listSpaces = this.arrUnrevealedNearby([lop, lop2]);

            if (listSpaces.length === this.boardRecv[lop][lop2]) {
                var front = listSpaces.shift();
                while (front !== undefined) {
                    if (this.board[front[0]][front[1]] === 1) {
                        front = listSpaces.shift();
                        continue;
                    }
                    this.board[front[0]][front[1]] = 1;

                    front = listSpaces.shift();
                }
            }
        }
    }
};

AutoSweeper.prototype.findSafePos = function () {
    var lop, lop2;
    for (lop = 0; lop < this.x; lop++) {
        for (lop2 = 0; lop2 < this.y; lop2++) {
            if (this.boardRecv[lop][lop2] === 0 || this.boardRecv[lop][lop2] === 'X') {
                // Not revealed or no mines nearby
                continue;
            }

            // Find  un-revealed space nearby
            var numMines = this.numMinesNearBy([lop, lop2]);
            if (numMines === this.boardRecv[lop][lop2]) {
                // Push all the safe space
                var list = this.arrSafePos([lop, lop2]);
                append(this.arrClickPos, list);
            }
        }
    }
};

AutoSweeper.prototype.next = function () {
    return this.arrClickPos.shift();
};

AutoSweeper.prototype.clickNext = function () {
    if (this.firstClick) {
        this.firstClick = false;

        var x = parseInt(Math.random() * this.boardRecv.length);
        var y = parseInt(Math.random() * this.boardRecv[x].length);

        this.arrClickPos.push([x, y]);
    }

    if (this.arrClickPos.length === 0) {
        this.findMinePos();
        this.findSafePos();
    }

    // 经历上面的寻找仍然没有可点的，那就随机一个吧
    if (this.arrClickPos.length === 0) {
        var x = 0;
        var y = 0;

        while (this.board[x][y] === 1 || this.boardRecv[x][y] !== 'X') {
            x = parseInt(Math.random() * this.boardRecv.length);
            y = parseInt(Math.random() * this.boardRecv[x].length);
        }

        this.arrClickPos.push([x, y]);
    }

    var front = this.arrClickPos.shift();

    if (front === undefined) {
        return;
    }

    console.log("Click", front);
    view.click(front, true);
};


var bot = new AutoSweeper();

$(document).ready(function () {
    // game.bot = bot;
});