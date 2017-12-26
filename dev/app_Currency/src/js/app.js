import Vue from 'vue/dist/vue.js';

import {Preferences} from './Preferences.js';
import {CurrencyConverter} from './CurrencyConverter';

Vue.component('row', {
    template: '#templateRow',
    props: ["data"]
});

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
        dataTopRow: function () {
            let tmp = {
                cache: this.converter.table[this.preferences.topRow['abbr']],
                amount: this.converter.convert(null, null, null)
            };

            return tmp;
        },
        dataOtherRows: function () {
            let ret = [];

            const table = this.converter.table;
            const rows = this.preferences.rows;

            const topRowAbbr = this.preferences.topRow.abbr;

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
