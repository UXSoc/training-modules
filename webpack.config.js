const path = require('path');

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
        open: true
    }
};