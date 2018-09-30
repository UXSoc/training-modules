var colors = require('colors');
var options = require('../config.json');
var emoji_engine = require('node-emoji');
var path = require('path');
var express = require('express');

var uniqueRandomArray = require('unique-random-array');
var rand_color = uniqueRandomArray(options.colors);
var rand_emoji = uniqueRandomArray(options.emojis);

var fsex = require('fs-extra');

var doT =  require('dot');
var fs = require('fs');
var writeJson = require('write-json');

global.home = "";
//Works in place, only needs to be called
function render_home() {
    var template = fs.readFileSync(path.join(__dirname + '/../html/home.html')).toString();
    var tempFn = doT.template(template);
    const modules_name = [];
    options.modules.forEach(function (data) {
        modules_name.push(data.name);
    });
    template_data = {
        name: modules_name,
        first_time: options.first_time
    };
    const renderHTML = tempFn(template_data);
    console.log("Success: built homepage".green.bold);
    home = renderHTML;
    console.log(options.first_time);
}

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
    if (current_config.is_first) {
        copy_from_too('./.hidden/modules/' + get_current_folder() + '/index.html', './.hidden/modules/' + get_current_folder() + '/save.html');
        current_config.is_first = false;
    }

    copy_from_too('./.hidden/modules/' + get_current_folder() + '/save.html', './index.html');
    writeJson.sync('./.hidden/modules/' + get_current_folder() + '/template.json', current_config);
}

function special_requests(app) {
    //These two needed for express to actually read the data
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.get('/on-load', function(req, res) {
        var current_config = get_current_json();

        var color = rand_color();
        var emoji = emoji_engine.get(rand_emoji());
        var title = current_config.title;
        var number = "#" + options.current;

         var output = {
             color,
             emoji,
             title,
             number
         };
         res.json(output);

         //automatic saving
        copy_from_too('./index.html', './.hidden/modules/' + get_current_folder() + '/save.html');

        if (options.first_time) {
            options.first_time = false;
            options.current = 1;

            render_home();
        }

        writeJson.sync('./.hidden/config.json', options);
    });

    app.get('/current', function (req, res) {
        var current_config = get_current_json();

        const send_data = {
            title: current_config.title,
            number: options.current,
        };

        res.json(send_data);
        console.log("Loading module " + current_config.title.green.bold + ' #' + options.current + " successfully");

        writeJson.sync('./.hidden/config.json', options);
    });

    app.get('/home', function (req, res) {
        console.log("Going home".dim);

        res.send(home);
    });

    app.get('/next', function(req, res) {
        //loops all modules
        options.current = (options.current + 1) % (options.modules.length + 1);
        if (options.current === 0) {
            options.current = 1;
        }

        get_mod();

        writeJson.sync('./.hidden/config.json', options);
    });

    app.get('/back', function (req, res) {
        options.current = options.current - 1;
        if (options.current === 0) {
            options.current = options.modules.length;
        }

        get_mod();

        writeJson.sync('./.hidden/config.json', options);
    });

    app.get('/wipe', function (req, res) {
        console.log("trying".bold);
        copy_from_too( './.hidden/modules/' + get_current_folder() + '/index.html' , './.hidden/modules/' + get_current_folder() + '/save.html');
        copy_from_too('./.hidden/modules/' + get_current_folder() + '/save.html', './index.html');
    });

    app.post('/open', function (req, res) {
        if (req.body.index) {
            options.current = req.body.index;
        }

        get_mod();
        res.end('yes');

        writeJson.sync('./.hidden/config.json', options);
    });
}

module.exports = {
    run: function(app) {
        console.log("Starting Front End UI".bold + " Version: ".dim + process.env.npm_package_version.dim);

        get_mod();
        render_home();
        special_requests(app);
    }
};
