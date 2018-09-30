const config = require('./node_modules/api-keys/glitch-modules.json');
var colors = require('colors');
const { exec } = require('child_process');

var command = "";
var debug = true;

//Making the command, env vars need to be first to have sync work correctly
command += "GLITCH_PROJECT_ID='" + config.projectID + "' ";
command += "GLITCH_TOKEN='" + config.authorization + "' ";
command += "GH_REPO='" + config.repo + "' ";
if (debug) {
    command += " DEBUG=sync-glitch* ";
}
command += "./node_modules/.bin/sync-glitch";

var dataCallback = function(data) {
    console.log(data);
};

console.log(command.dim);

exec(command, (err, stdout, stderr) => {
    if (err) {
        console.log("Error: could not run command, make sure that sync-config is correct".red);
        return;
    }

    //if statements needed to prevent extra lines if no error or out
    if (stdout !== "") {
        console.log(stdout.green + ' repo: ' + config.repo.bold);
    }

    if (stderr !== "") {
        console.log(stderr.red);
    }

    console.log("Done".green);
});
