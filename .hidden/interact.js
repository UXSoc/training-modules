var colors = require('colors');
console.log(__dirname);
var config = require('./config.json');

function special_requests(app) {
  app.get('/color', function(req, res) {
     res.json({ color: '#00FFFF' });
  });
}

module.exports = {
    run: function(app) {
        console.log("Starting Front End UI".bold + " Version: ".dim + process.env.npm_package_version.dim);

        special_requests(app);
    }
};
