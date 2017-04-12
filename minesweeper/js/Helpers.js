/**
 * Created by jeff on 2017/3/11.
 */

function defaultFunc() {
    // Do nothing
};

/**
 *
 * @param {number[]} pos
 * @return {*|jQuery|HTMLElement}
 */
function select(pos) {
    return $(sprintf("#%d-%d", pos[0], pos[1]));
}

/**
 * Create 2D array
 * @param {number} x
 * @param {number} y
 * @param {*} defaultVal
 * @return {Array}
 */
function create2DArray(x, y, defaultVal) {
    /**
     * @type {Array}
     */
    var tmp = new Array(x);
    var lop;
    for (lop = 0; lop < x; lop++) {
        /**
         * @type {Array}
         */
        tmp[lop] = new Array(y);
        tmp[lop].fill(defaultVal);
    }

    return tmp;
}

/**
 *
 * @param arr
 * @param pos
 * @return {*}
 */
function getElementAt(arr, pos) {
    return arr[pos[0]][pos[1]];
}

/**
 * Return true if the given pos is in the array
 * @param {Array}arr
 * @param {Array}pos
 * @returns {boolean}
 */
function contains(arr, pos) {
    var i;
    for (i = 0; i < arr.length; i++) {
        if (arr[i][0] === pos[0] && arr[i][1] === pos[1]) {
            return true;
        }
    }

    return false;
}

/**
 * Merge two list
 * @param {Array}original
 * @param {Array}additional
 */
function append(original, additional) {
    var front = additional.shift();
    while (front !== undefined) {
        if (!contains(original, front)) {
            original.push(front);
        }

        front = additional.shift();
    }
}

/**
 * Clear the click event handler from square class
 * Only do this after game over
 */
function clearCallbackFromSquares() {
    $(".square").off("click");
}

function updateWinLoseInfo(numWin, numLose) {
    $("#label_total").text(numWin + numLose);
    $("#label_win_rate").text((numWin / (numWin + numLose) * 100).toFixed(2));
    $("#label_win").text(numWin);
    $("#label_lose").text(numLose);
}