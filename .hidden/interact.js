var colors = require('colors');
var config = require('./config.json');
var emoji_engine = require('node-emoji');

var uniqueRandomArray = require('unique-random-array');
var rand_color = uniqueRandomArray(config.colors);
var rand_emoji = uniqueRandomArray(config.emojis);

function special_requests(app) {
  app.get('/on-load', function(req, res) {
    var color = rand_color();
    var emoji = emoji_engine.get(rand_emoji());

     var output = {
       color,
       emoji
     };
     res.json(output);
  });
}

module.exports = {
    run: function(app) {
        console.log("Starting Front End UI".bold + " Version: ".dim + process.env.npm_package_version.dim);

        special_requests(app);
    }
};
