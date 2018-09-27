const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './.hidden/index.js',
    output: {
        filename: 'script.js',
        path: path.resolve(__dirname, './.hidden/public')
    },
    devServer: {
        contentBase: path.join(__dirname, './.hidden/public'),
        compress: false,
        port: 4567,
        open: true,
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: 'index.html',
            filename: 'index.html'
        })
    ]
};