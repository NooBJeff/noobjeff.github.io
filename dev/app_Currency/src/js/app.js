import Vue from 'vue/dist/vue.js';

import {Preferences} from './Preferences.js';
import {CurrencyConverter} from './CurrencyConverter';

// Vue.component('row', {
//     template: '#templateRow',
//     props: ["data"]
// });

const app = new Vue({
    el: "#app",
    data: {
        preferences: new Preferences(),
        converter: new CurrencyConverter(),
        USD: {
            imgNation: "",
            nameNation: 'U.S.A',
            abbrNation: 'USD',
            moneyUnit: "dollar",
            rate: 1
        }
    },
    computed: {
        dataRows: function () {
            const table = this.converter.table;
            const rows = this.preferences.rows;

            const topRowAbbr = this.preferences.topRow.abbr;

            let ret = [];
            // 先把Top的放进来
            ret.push({
                cache: table[topRowAbbr],
                amount: this.converter.convert(null, null, null)
            });

            for (let each in rows) {
                // Dont forget that for-in for arrays returns index
                each = rows[each];
                if (each === topRowAbbr) {
                    continue;
                }

                let tmp = {
                    cache: table[each],
                    amount: this.converter.convert(null, null, null)
                };

                ret.push(tmp);
            }

            return ret;
        }
    },
    methods: {
        changeTopRow: function (abbr) {
            this.preferences.topRow["abbr"] = abbr;
        }
    }
});
