export {CurrencyConverter};

class CurrencyConverter {
    constructor() {
        // 从网络或者本地缓存获取汇率
        this.table = {
            'USD': {
                imgNation: "",
                nameNation: 'U.S.A',
                abbrNation: 'USD',
                moneyUnit: "dollar",
                rate: 1
            },
            'CNY': {
                imgNation: "",
                nameNation: 'China',
                abbrNation: 'CNY',
                moneyUnit: "元",
                rate: 6
            }
        }
    }

    convert(from, to, amount) {
        return 1000
    }
}