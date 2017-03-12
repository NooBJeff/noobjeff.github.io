/**
 * Created by jeff on 2017/3/11.
 */

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
