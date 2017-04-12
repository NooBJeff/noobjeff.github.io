/**
 * Created by jeff on 2017/3/12.
 */

function AutoSweeper() {
    this.board = undefined;
    this.boardRecv = undefined;

    /**
     * The size of board
     * Number of rows
     * @type {number}
     */
    this.x = undefined;
    /**
     * The size of board
     * Number of columns
     * @type {number}
     */
    this.y = undefined;
    /**
     * Is this round a new round?
     * (i.e No square being clicked)
     * @type {boolean}
     */
    this.newRound = true;
}

/**
 * Reset AutoSweeper
 */
AutoSweeper.prototype.ctrReset = function () {
    this.boardRecv = undefined;

    this.board = undefined;
    this.x = undefined;
    this.y = undefined;
    this.newRound = true;
};

/**
 * Receive the game board info from Game
 * @param data
 */
AutoSweeper.prototype.ctrReceiveBoardFromGame = function (data) {
    this.boardRecv = data;

    if (this.board === undefined) {
        this.x = data.length;
        this.y = data[0].length;
        this.board = create2DArray(this.x, this.y, false);
    }
};

/**
 * Find all un-revealed squares nearby
 * @param pos
 * @return {Array}
 */
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

/**
 * Count how many already-known mines are there nearby
 * @param pos
 * @return {number}
 */
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

/**
 * Return next pos to click
 * @return {Array} Pos to click
 */
AutoSweeper.prototype.clickNext = function () {
    if (this.newRound) {
        this.newRound = false;

        var x = parseInt(Math.random() * this.boardRecv.length);
        var y = parseInt(Math.random() * this.boardRecv[x].length);

        this.arrClickPos.push([x, y]);
    }

    if (this.arrClickPos.length === 0) {
        this.findMinePos();
        this.findSafePos();
    }

    // No safe pos to click
    // Random one
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
        return null;
    }

    return front;
};

function Wrapper() {
    this.nextMoveReady = false;

    this.jobID = undefined;
}

Wrapper.prototype.addCallbackToOnGameReadyEvent = function () {
    game.onGameReady(function (me) {
        return function () {
            me.nextMoveReady = true;
        }
    }(this));
};

/**
 * Start the bot
 */
Wrapper.prototype.run = function () {
    this.nextMoveReady = true;

    this.jobID = setInterval(function (me) {
        return function () {
            if (me.nextMoveReady) {
                me.nextMoveReady = false;
                bot.ctrReceiveBoardFromGame(game.print());
                view.click(bot.clickNext(), true);
            }
        };
    }(this), 500);
};

Wrapper.prototype.gameOver = function () {
    clearInterval(this.jobID);
    this.jobID = undefined;
    this.nextMoveReady = false
};

Wrapper.prototype.reset = function () {
    bot.ctrReset();
};

var bot = new AutoSweeper();
var wrapper = new Wrapper();

$(document).ready(function () {
    wrapper.addCallbackToOnGameReadyEvent();
});