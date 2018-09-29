var program = require('commander');
const colors = require('colors');

var copyfiles = require('copyfiles');
const { exec } = require('child_process');

program
  .option('-n, --new [type]', 'Makes a new modules the the [folder name] given')
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
    copyfiles(['./.hidden/modules/index.html','./.hidden/modules/template.json', './.hidden/modules/' +  program.new], {up: true}, function (err) {
        if (err) {
            console.log("Error, copying files failed".red.bold);
            return;
        }

        console.log("Success: ".green.bold + "new module created in folder: " + program.new.bold);
        exec('npm run backup', (err, stdout, stderr) => {
            if (err) {
                console.error('Error when adding to github: '.red.bold + err);
                return;
            }
            console.log(stdout);
            console.log(stderr);

            console.log("Also backed uo files when making module".dim);
        });
    })
});
