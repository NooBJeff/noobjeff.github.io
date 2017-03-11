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


