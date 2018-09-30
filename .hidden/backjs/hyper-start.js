//Needed so that glitch will start webpack

const spawn = require('child_process').spawn,

run = spawn('npm', ['start']);

run.stdout.on('data', function (data) {
    console.log(data.toString());
});

run.stderr.on('data', function (data) {
    console.log(data.toString());
});

run.on('exit', function (code) {
    console.log('Server exited with code:  ' + code.toString());
});