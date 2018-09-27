const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
var HtmlWebpackInsertAtBodyEndPlugin = require('html-webpack-insert-at-body-end');


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
        watchContentBase: true,
        hotOnly: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: 'index.html',
            filename: 'index.html',
        }),
        new HtmlWebpackInsertAtBodyEndPlugin({
            filename: 'index.html', scriptSrc: 'script.js'}
        ),
        new webpack.HotModuleReplacementPlugin()
    ]
};