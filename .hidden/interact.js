var colors = require('colors');

module.exports = {
    run: function(app) {
        console.log("Starting Front End UI".bold + " Version: ".dim + process.env.npm_package_version.dim);
        app.get('/test', function(req, res) {
           res.json({ custom: 'response' });
        });
    }

};