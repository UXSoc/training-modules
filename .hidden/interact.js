var colors = require('colors');

module.exports = {
    run: function(app) {
        console.log("Starting Front End UI".bold);
        app.get('/test', function(req, res) {
=            res.json({ custom: 'response' });
        });
    }

};