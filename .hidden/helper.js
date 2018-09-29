//Needed for all
var program = require('commander');
const colors = require('colors');
var options = require('./config.json');
var module_options = require('./modules/template.json');

//Needed for new
var copyfiles = require('copyfiles');
const { exec } = require('child_process');
var prompt = require('prompt');
var writeJson = require('write-json');

//needed for remove
var rmdir = require('rmdir');

program
    .option('-n, --new [type]', 'Makes a new modules the the [folder name] given')
    .option('-d, --delete [type]', 'Deletes a modules its [number] given')
    .parse(process.argv);


// flag_name: string - name printed on error
// output: var - the output of the commander ie program.new
// when_full: function - called when a parameter is succesfully passed to the program through this command
function if_flag_then(flag_name, output, when_full) {
  if (output) {
    if (typeof output === "boolean") {
      console.log("Error:".red.bold + " no value included for command: " + flag_name.bold);
      console.log("Run this command again with syntax ".dim + "npm run new 'folder_name'");
    } else {
      when_full(process.new);
    }
  }
}

if_flag_then("new", program.new, function() {
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

        copyfiles(['./.hidden/modules/index.html', './.hidden/modules/' +  program.new], {up: true}, function (err) {
            if (err) {
                console.log("Error, copying files failed".red.bold);
                console.log(err);
                return;
            }

            module_options.title = result.name;
            writeJson.sync('./.hidden/modules/' + program.new +'/template.json', module_options);

            const module_num = options.modules.length + 1;
            options.modules.push(program.new);
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
        console.log("Deleting Module: " + program.delete.bold + " in folder " + options.modules[program.delete - 1]);

        prompt.message = "Prompt".bold;
        prompt.start();

        prompt.get({
            properties: {
                name: {
                    description: ("Are you sure? (yes/no): ").blue.bold
                }
            }
        }, function (err, result) {
            if (err) {
                console.log("Error ".red.bold + "when getting prompt");
                console.log("Error ".red.bold + err);
            }

            if (result.name !== "yes") {
                console.log("Aborted, delete canceled".bold.yellow);
                return;
            }

            rmdir('./.hidden/modules/' + options.modules[program.delete - 1], function (err, dirs, files) {
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

