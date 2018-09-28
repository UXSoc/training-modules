const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackInsertAtBodyEndPlugin = require('html-webpack-insert-at-body-end');

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
        contentBase: [
            path.join(__dirname, ''),
            path.join(__dirname, '.hidden/public')
        ],
        port: 4567,
        open: true,
        hot: true,
        watchContentBase: true,
        hotOnly: true,
        stats: {
            hash: false,
            version: false,
            assets: false,
            chunks: false,
            modules: false,
            source: false,
            publicPath: false
        },
        before: function(app) {
            var interact = require('./.hidden/interact.js');
            interact.run(app);
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: 'index.html',
            filename: 'index.html',
        }),
        new HtmlWebpackInsertAtBodyEndPlugin({
            filename: 'index.html',
            scriptSrc: 'script.js'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};