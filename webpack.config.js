const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        script: './.hidden/index.js'
    },
    output: {
        filename: 'script.js',
        path: path.resolve(__dirname, './.hidden/public')
    },
    devServer: {
        contentBase: path.join(__dirname, './index.html'),
        port: 4567,
        open: true,
        hot: true,
        watchContentBase: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            template: 'index.html',
            filename: 'index.html'
        }),
    ]
};