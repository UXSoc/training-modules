var colors = require('colors');

var options = require('../config.json');
var emoji_engine = require('node-emoji');
var path = require('path');
var express = require('express');

var uniqueRandomArray = require('unique-random-array');
var rand_color = uniqueRandomArray(options.colors);
var rand_emoji = uniqueRandomArray(options.emojis);

var fsex = require('fs-extra');
var fs = require('fs');

var doT =  require('dot');

global.home = "";
global.template = fs.readFileSync(path.join(__dirname + '/../html/home.html')).toString();
global.tempFn = doT.template(template);

//Works in place, only needs to be called
//Generates the home html, then moves it to global scope to the home variable
function render_home() {
    var modules_links = [];

    options.modules.forEach(function (data) {
        var one_mod = [data.name, data.not_visited];
        modules_links.push(one_mod);
    });

    const template_data = {
        first_time: options.first_time,
        mods: modules_links
    };

    const renderHTML = tempFn(template_data);

    console.log("Success: built homepage".green.bold);
    home = renderHTML;
}

//return - string of folder name
function get_current_folder() {
    if (options.modules.length === 0) {
        console.log("Error: ".red.bold + "no modules found");
        console.log("Serving default template as a result");
        //returns the current dir, which is just '.' in unix
        //this is not just a period
        //when plugged into get_current_json, this allows it to get the default template path
        return "default";
    }

    var current_folder = options.modules[options.current - 1].folder;
    return current_folder;
}

//Loads the current config file into program
function get_current_json() {
    return require('../modules/' + get_current_folder() + '/template.json');
}

//Simple wrapper function,
function copy_from_too(source, destination) {
    try {
        fsex.copySync(path.resolve(source), destination);
    } catch (err) {
        console.error("Error: ".red.bold + "could not copy file " + source.bold + " to destination " + destination.bold);
    }
}

function writeJson(file, object) {
    try {
        fsex.writeJsonSync(file, object);
    } catch (err) {
        console.error("Error: ".red.bold + "could not write object " + object.bold + " to destination " + file.bold);
    }
}

//Moves the index the module to the main index file
function get_mod() {
    if (options.modules[options.current - 1].not_visited) {
        copy_from_too('./.hidden/modules/' + get_current_folder() + '/index.html', './.hidden/modules/' + get_current_folder() + '/save.html');
        options.modules[options.current - 1].not_visited = false;
        render_home();
    }

    copy_from_too('./.hidden/modules/' + get_current_folder() + '/save.html', './index.html');
    writeJson('./.hidden/config.json', options);
}

function special_requests(app) {
    //These two needed for express to actually read the data
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    //GET
    app.get('/on-load', function(req, res) {
        var current_config = get_current_json();

        var color = rand_color();
        var emoji = (options.ui_open ? "–" : "+") + emoji_engine.get(rand_emoji());
        var title = current_config.title;
        var number = "#" + options.current;
        //Needs to know if this is the first time to workaround reload not working on the first
        var first = options.first_time;

        var output = {
            color,
            emoji,
            title,
            number,
            first
        };
        res.json(output);

        //automatic saving
        copy_from_too('./index.html', './.hidden/modules/' + get_current_folder() + '/save.html');

        if (options.first_time) {
            options.first_time = false;
            render_home();
        }

        writeJson('./.hidden/config.json', options);

        //To fix an issue where navigating to root on first doesn't load
        if (options.modules[options.current - 1].not_visited) {
            get_mod();
        }
    });

    //GET
    app.get('/home', function (req, res) {
        console.log("Going home".dim);

        res.send(home);
    });

    //GET
    app.get('/next', function(req, res) {
        //loops all modules
        options.current = (options.current + 1) % (options.modules.length + 1);
        if (options.current === 0) {
            options.current = 1;
        }

        get_mod();

        writeJson('./.hidden/config.json', options);
    });

    //GET
    app.get('/back', function (req, res) {
        options.current = options.current - 1;
        if (options.current === 0) {
            options.current = options.modules.length;
        }

        get_mod();

        writeJson.sync('./.hidden/config.json', options);
    });

    //GET
    app.get('/wipe', function (req, res) {
        copy_from_too( './.hidden/modules/' + get_current_folder() + '/index.html' , './.hidden/modules/' + get_current_folder() + '/save.html');
        copy_from_too('./.hidden/modules/' + get_current_folder() + '/save.html', './index.html');
    });

    //POST
    app.post('/open', function (req, res) {
        if (req.body.index) {
            options.current = parseInt(req.body.index, 10);
        }

        get_mod();
        res.end('yes');

        writeJson('./.hidden/config.json', options);
    });

    //can't handle a lot of requests for some reason, but first always gets through
    //GET
    app.get('/toggle_ui', function (req, res) {
        options.ui_open = !options.ui_open;
        //has to send back to close out request or else will light crash
        res.send("UI toggle saved");
    });
}

module.exports = {
    run: function(app) {
        console.log("Starting Front End UI".bold + " Version: ".dim);

        render_home();
        special_requests(app);
    }
};
