/**
 * Created by jeff on 2017/3/12.
 */

function AutoSweeper() {
    this.board = undefined;

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
    if (this.board === undefined) {
        // Initilize
        this.x = data.length;
        this.y = data[0].length;
    }

    this.board = data;
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
                // Skip the square in the middle
                continue;
            }

            if (this.board[lop][lop2] === SQUARE_TYPE.UNREVEALED) {
                ret.push([lop, lop2]);
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

            if (this.board[lop][lop2] === SQUARE_TYPE.FLAGGED) {
                ret += 1;
            }
        }
    }

    return ret;
};

/**
 * Find bomb and flag them
 * @return {undefined|pos} null if there is no mines found for now
 */
AutoSweeper.prototype.findMinePos = function () {
    var lop, lop2;
    for (lop = 0; lop < this.x; lop++) {
        for (lop2 = 0; lop2 < this.y; lop2++) {
            // Keep squares with numbers only
            if (this.board[lop][lop2] <= 0) {
                continue;
            }

            var list = this.arrUnrevealedNearby([lop, lop2]);
            if (list.length === 0) {
                continue;
            }

            var numMines = this.numMinesNearBy([lop, lop2]);
            if ((list.length + numMines) === this.board[lop][lop2]) {
                // Every pos in the list contains a mine
                return list[0];
            }
        }
    }

    return undefined;
};

/**
 * Find a safe pos to click
 * @return {undefined|pos}
 */
AutoSweeper.prototype.findSafePos = function () {
    var lop, lop2;
    for (lop = 0; lop < this.x; lop++) {
        for (lop2 = 0; lop2 < this.y; lop2++) {
            // Keep squares with numbers only
            if (this.board[lop][lop2] <= 0) {
                continue;
            }

            var numMines = this.numMinesNearBy([lop, lop2]);
            if (numMines === this.board[lop][lop2]) {
                // All mines near this square are flagged
                // So whats left is safe pos
                var result = this.arrUnrevealedNearby([lop, lop2]);
                if (result.length === 0) {
                    continue;
                }

                return result[0];
            }
        }
    }

    return undefined;
};

/**
 * Return next pos to click
 * @return {Array} Pos to click
 */
AutoSweeper.prototype.nextPosToClick = function () {
    if (this.newRound) {
        this.newRound = false;

        var _x = parseInt(Math.random() * this.x);
        var _y = parseInt(Math.random() * this.y);

        // console.log("New Round", _x, _y, true);
        return [[_x, _y], true];
    }

    var posMine = this.findMinePos();
    if (posMine !== undefined) {
        // console.log("Bomb", posMine, false);
        return [posMine, false];
    }

    var posSafe = this.findSafePos();
    if (posSafe !== undefined) {
        // console.log("Safe", posSafe, true);
        return [posSafe, true];
    }

    // No safe nor mine
    // Random one
    var x = 0, y = 0;
    do {
        x = parseInt(Math.random() * this.x);
        y = parseInt(Math.random() * this.y);
    } while (this.board[x][y] !== SQUARE_TYPE.UNREVEALED);

    // console.log("Random", x, y, true);
    return [[x, y], true];
};

var bot = new AutoSweeper();
