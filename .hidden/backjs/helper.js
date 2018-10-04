//Needed for all
var program = require('commander');
const colors = require('colors');
var options = require('../config.json');
var module_options = require('../modules/template.json');

//Needed for new
var copyfiles = require('copyfiles');
const { exec } = require('child_process');
var prompt = require('prompt');
var writeJson = require('write-json');

//needed for remove
var rmdir = require('rmdir');

//needed for reset
var path = require('path');
var fsex = require('fs-extra');

program
    .option('-n, --new [type]', 'Makes a new modules the the [folder name] given')
    .option('-d, --delete [type]', 'Deletes a modules with its [number] given')
    .option('-m, --modules', 'Print all modules to the console')
    .option('-r, --reset', 'sets the config file back to default')
    .parse(process.argv);


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

// flag_name: string - name printed on error
// output: var - the output of the commander ie program.new
// when_full: function - called when a parameter is succesfully passed to the program through this command
/////////   Only used for flags with input
function if_flag_then(flag_name, output, when_full) {
  if (output) {
    if (typeof output === "boolean") {
      console.log("Error:".red.bold + " no value included for command: " + flag_name.bold);
      console.log("Run this command again with syntax ".dim + "npm run new 'folder_name'");
    } else {
      when_full(output);
    }
  }
}

function if_flag(flag_name, output, when_called) {
    if (output) {
            when_called(output);
    }
}
if_flag_then("new", program.new, function() {
    if (fsex.existsSync('./.hidden/modules/' +  program.new)) {
        console.log("Error: ".red.bold + "folder already exists, please we run with a different name");
        return;
    }

    prompt.start();
    prompt.message = "Prompt".bold;

    prompt.get({
        properties: {
            name: {
                description: ("What should the module be called?").blue.bold
            }
        }
    }, function (err, result) {
        if (err) {
            console.log("Error ".red.bold + "when getting prompt");
            console.log("Error ".red.bold + err);
        }

        copyfiles(['./.hidden/modules/index.html', './.hidden/modules/save.html','./.hidden/modules/' +  program.new], {up: true}, function (err) {
            if (err) {
                console.log("Error, copying files failed".red.bold);
                console.log(err);
                return;
            }

            module_options.title = result.name;
            writeJson.sync('./.hidden/modules/' + program.new +'/template.json', module_options);

            const module_num = options.modules.length + 1;
            options.modules.push({
                "folder": program.new,
                "name": result.name,
                "not_visited": true
            });
            writeJson.sync('./.hidden/config.json', options);

            // Note: module num can't be colored because it is const and immutable
            console.log("Success: ".green.bold + "new module called: " + result.name.bold
                        + ' (#' + module_num + ')' + " created in folder: " + program.new.bold);
            exec('npm run backup', (err, stdout, stderr) => {
                if (err) {
                    console.error('Error when adding to github: '.red.bold + err);
                    return;
                }
                console.log(stdout);
                console.log(stderr);

                console.log("Also backed up files when making module".dim);
            });
        });
    });
});

function check_valid_mod_num(num) {
    if (isNaN(num)) {
        return false;
    }

    if (options.modules.length < num) {
        return false;
    }

    if (num <= 0) {
        return false;
    }

    return true;
}

if_flag_then("delete", program.delete, function () {
    if (check_valid_mod_num(program.delete)) {
        console.log("Deleting Module: " + program.delete.bold + " in folder "
                    + options.modules[program.delete - 1].folder.bold + " called '" + options.modules[program.delete - 1].name.bold+ "'");

        prompt.message = "Prompt".bold;
        prompt.start();

        prompt.get({
            properties: {
                responce: {
                    description: ("Are you sure? (yes/no): ").blue.bold
                }
            }
        }, function (err, result) {
            if (err) {
                console.log("Error ".red.bold + "when getting prompt");
                console.log("Error ".red.bold + err);
            }

            if (result.responce !== "yes") {
                console.log("Aborted, delete canceled".bold.yellow);
                return;
            }

            rmdir('./.hidden/modules/' + options.modules[program.delete - 1].folder, function (err, dirs, files) {
                if (err) {
                    console.log("Error: ".red + "when deleting files");
                    console.log(err);
                }

                console.log("Deleting dir: " + dirs.join(" ").bold);
                console.log("Deleting files: " + files.join(" \n").bold);

                //delete from array too
                options.modules.splice(options.modules, program.delete);
                writeJson.sync('./.hidden/config.json', options);
            });
        });
    } else {
        console.log("Error (Out of Range): ".red + "please only pass a number corresponding to the module");
    }
});

if_flag("modules", program.modules, function () {
    console.log("All modules: ".blue.bold);
    console.log("[Num]\t[Name]\t/[folder name]".dim);

    options.modules.forEach(function (mod, i) {
        console.log(i + 1 + '\t'+ mod.name.bold + '   /' + mod.folder);
    })
});

if_flag("reset", program.reset, function () {
    console.log("Resetting".green + " modules");

    options.current = 1;
    options.first_time = true;
    options.ui_open = true;

    options.modules.forEach(function (mod) {
        var current_config = get_current_json();
        current_config.is_first = true;

        mod.not_visited = true;
        writeJson('./.hidden/modules/' + get_current_folder() + '/template.json', current_config, function () {});

        fsex.copySync(path.resolve('./.hidden/modules/save.html'), './.hidden/modules/' + get_current_folder() + '/save.html');
    });

    fsex.copySync(path.resolve('./.hidden/modules/save.html'), './index.html');
    writeJson('./.hidden/config.json', options, function () {});
});
