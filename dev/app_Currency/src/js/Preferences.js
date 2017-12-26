export {Preferences};

class Preferences {
    constructor() {
        // todo: 从内存读取或者新建

        // 显示的国家
        // 每一项为国家三个英文字母的缩写
        this.rows = ['USD', 'CNY'];
        this.topRow = {
            abbr: 'USD',
            amount: 999
        };
    }
}

