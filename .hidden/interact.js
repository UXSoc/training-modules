var colors = require('colors');
var config = require('./config.json');

var uniqueRandomArray = require('unique-random-array');
var rand_color = uniqueRandomArray(config.colors);

function special_requests(app) {
  app.get('/color', function(req, res) {
    var color = rand_color();
     var output = {
       color
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
