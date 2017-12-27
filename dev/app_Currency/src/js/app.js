import Vue from 'vue/dist/vue.js';

import {Preferences} from './Preferences.js';
import {CurrencyConverter} from './CurrencyConverter';

import './../scss/index.scss';

const app = new Vue({
    el: "#app",
    data: {
        preferences: new Preferences(),
        converter: new CurrencyConverter(),
        // 以下3项需要onload初始化
        // 当前正在编辑的国家的abbr
        editing: null,
        editingAmount: null,
        isEditing: false
    },
    computed: {
        dataAmount: function () {
            // 返回dict
            // abbr -> money
            const rows = this.preferences.rows;

            let ret = {};

            for (let each in rows) {
                each = rows[each];

                ret[each] = (each === this.editing)
                        ? this.editingAmount
                        : this.converter.convert(this.editing, this.editingAmount, each)
            }

            return ret;
        },
        dataRows: function () {
            const table = this.converter.table;
            const rows = this.preferences.rows;

            const topRowAbbr = this.preferences.topRow.abbr;

            let ret = [];
            // 先把Top的放进来
            ret.push({
                cache: table[topRowAbbr],
                amount: this.round(this.dataAmount[topRowAbbr])
            });

            for (let each in rows) {
                // Dont forget that for-in for arrays returns index
                each = rows[each];
                if (each === topRowAbbr) {
                    continue;
                }

                let tmp = {
                    cache: table[each],
                    amount: this.round(this.dataAmount[each])
                };

                ret.push(tmp);
            }

            return ret;
        }
    },
    methods: {
        round: function (num) {
            return Math.round(num * 10) / 10;
        },
        changeTopRow: function (abbr) {
            // 改变top的row，但是保留当前金额
            const prevAmount = this.dataAmount[this.preferences.topRow["abbr"]];
            this.preferences.topRow["abbr"] = abbr;

            // 触发dataAmount重算
            this.editing = abbr;
            this.editingAmount = this.round(prevAmount);
        },
        editRow: function (abbr) {
            this.editingAmount = this.round(this.dataAmount[abbr]);
            this.editing = abbr;

            this.isEditing = true;
        },
        doneEdit: function (abbr) {
            this.isEditing = false;
        },
        beforeDestroy: function () {
            // update topRow.amount
            this.preferences.topRow["amount"] = this.dataAmount[this.preferences.topRow["abbr"]];

            // Save
            this.preferences.save();
            this.converter.save();
        }
    },
    beforeMount: function () {
        // 读取
        this.preferences.load();
        this.converter.load();

        this.editing = this.preferences.topRow["abbr"];
        this.editingAmount = this.preferences.topRow["amount"];
    },

});

window.onbeforeunload = function () {
    if (FLAG_SAVE) {
        app.beforeDestroy();
    }
};
