var colors = require('colors');
var options = require('../config.json');
var emoji_engine = require('node-emoji');
var path = require('path');

var uniqueRandomArray = require('unique-random-array');
var rand_color = uniqueRandomArray(options.colors);
var rand_emoji = uniqueRandomArray(options.emojis);

var fsex = require('fs-extra');

var doT =  require('dot');
var fs = require('fs');
var template = fs.readFileSync(path.join(__dirname + '/../html/home.html')).toString();
var tempFn = doT.template(template);
const modules_name = [];
options.modules.forEach(function (data) {
   modules_name.push(data.name);
});
template_data = {
    name: modules_name
};
const renderHTML = tempFn(template_data);
console.log("Success: built homepage".green.bold);

//return - string of folder name
function get_current_folder() {
    if (options.modules.length === 0) {
        console.log("Error: ".red.bold + "not modules found");
        console.log("Serving default template as a result");
        //returns the current dir, which is just '.' in unix
        //this is not just a period
        //when plugged into get_current_json, this allows it to get the default template path
        return ".";
    }

    var current_folder = options.modules[options.current - 1].folder;
    return current_folder;
}

function get_current_json() {
    return require('../modules/' + get_current_folder() + '/template.json');
}

//first file has to exist
//TODO: add error handling
function copy_from_too(source, destination) {
    fsex.copySync(path.resolve(source), destination);
}

function get_mod() {
    var current_config = get_current_json();
    console.log(current_config.is_first);
    if (current_config.is_first) {
        copy_from_too('./.hidden/modules/' + get_current_folder() + '/index.html', './.hidden/modules/' + get_current_folder() + '/save.html');
        current_config.is_first = false;
        console.log("done");
    }

    copy_from_too('./.hidden/modules/' + get_current_folder() + '/save.html', './index.html');
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

     //automatic saving
    copy_from_too('./index.html', './.hidden/modules/' + get_current_folder() + '/save.html');
    });

    app.get('/current', function (req, res) {
        var current_config = get_current_json();

        const send_data = {
            title: current_config.title,
            number: options.current,
        };

        res.json(send_data);
        console.log("Loading module " + current_config.title.green.bold + ' #' + options.current + " successfully");
    });

    app.get('/home', function (req, res) {
        console.log("Going home".dim);

        res.send(renderHTML);
    });

    app.get('/next', function(req, res) {
        //loops all modules
        options.current = (options.current + 1) % (options.modules.length + 1);
        if (options.current === 0) {
            options.current = 1;
        }

        get_mod();
    });

    app.get('/back', function (req, res) {
        options.current = options.current - 1;
        if (options.current === 0) {
            options.current = options.modules.length;
        }

        get_mod();
    });

    app.get('/wipe', function (req, res) {
       copy_from_too( './.hidden/modules/' + get_current_folder() + '/index.html' , './.hidden/modules/' + get_current_folder() + '/save.html');
       copy_from_too('./.hidden/modules/' + get_current_folder() + '/save.html', './index.html');
    });

    app.get('/open', function (req, res) {
        
    });
}

module.exports = {
    run: function(app) {
        console.log("Starting Front End UI".bold + " Version: ".dim + process.env.npm_package_version.dim);

        special_requests(app);
    }
};
