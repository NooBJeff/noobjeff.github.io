export {Preferences};

let instance = null;

class Preferences {
    constructor() {
        // Singleton
        if (instance) {
            return instance;
        }

        instance = this;

        this.STORAGE_KEY = 'jeff-currency-converter';

        // 显示的国家
        // 每一项为国家三个英文字母的缩写
        this.rows = ['USD', 'CNY', 'EUR', 'JPY', 'HKD', 'KRW', 'AUD', 'GBP'];
        /**
         * abbr: 仅当以下情况时修改
         *       0.新建时
         *       1.用户点击其他行，导致changeTopRow触发
         *       2.用户退出，保存当前topRow的abbr
         * amount：仅当以下情况时修改
         *       1.新建时
         *       2.用户退出，保存当前topRow的amount
         * @type {{abbr: string, amount: number}}
         */
        this.topRow = {
            abbr: 'USD',
            amount: 1000
        };
    }

    load() {
        // beforeMount 时调用
        let storage = localStorage.getItem(this.STORAGE_KEY);

        if (storage === null) {
            console.log("No local storage found, using default");
            return;
        }

        // 本地储存非空，则覆盖默认值
        try {
            storage = JSON.parse(storage);
            const rows = storage["rows"];
            const topRow = storage["topRow"];
            this.rows = rows;
            this.topRow = topRow;
        } catch (e){
            // 本地储存格式不对，使用默认值
            console.log("Bad local storage, using default");
        }
    }

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
            rows: this.rows,
            topRow: this.topRow
        }));
    }
}

