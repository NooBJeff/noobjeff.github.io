const path = require('path');

var APP_NAME = 'Currency';

const ROOT_PATH = path.resolve(__dirname, '../../');
const DIST_PATH = path.resolve(ROOT_PATH, APP_NAME);

module.exports = {
    entry: './src/js/app.js',
    output: {
        path: path.resolve(DIST_PATH, 'js'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
        ],
    },
};