var colors = require('colors');
var options = require('./config.json');
var emoji_engine = require('node-emoji');

var uniqueRandomArray = require('unique-random-array');
var rand_color = uniqueRandomArray(options.colors);
var rand_emoji = uniqueRandomArray(options.emojis);

//return - string of folder name
function get_current_folder() {
    var current_folder = options.modules[options.current - 1].folder;
    return current_folder;
}

function get_current_json() {
    return require('./modules/' + get_current_folder() + '/template.json');
}

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

    app.get('/current', function (req, res) {
        var current_config = get_current_json();

        const send_data = {
            title: current_config.title,
            number: options.current,
        };

        res.json(send_data);
        console.log("Sending module " + current_config.title.green.bold + ' #' + options.current + " successfully");
    });
}

module.exports = {
    run: function(app) {
        console.log("Starting Front End UI".bold + " Version: ".dim + process.env.npm_package_version.dim);

        special_requests(app);
    }
};
