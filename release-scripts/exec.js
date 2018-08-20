const exec = require('child_process').exec;
const spawnChildProcess = require('child_process').spawn;
const os = require('os');

class Exec {
    static executePromise(command) {
        return new Promise((resolve, reject) => {
            exec(command, (err, stdout, stderr) => {
                if (err != null) {
                    reject(new Error(err));
                } else if (typeof (stderr) != "string") {
                    reject(new Error(stderr));
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    static async execute({
        command: command,
        successLog: successLog,
        errorLog: errorLog,
        exit: exit = true
    }) {
        try {
            const output = await Exec.executePromise(command);
            console.log(`✅  ${successLog}`);
            return output;
        } catch (error) {
            console.log(`❎  ${errorLog}`, error);
            if (exit) process.exit(1);
        }
    }

    static async spawn({
        command: command,
        args: args,
        successLog: successLog,
        errorLog: errorLog,
        exit: exit = true
    }) {
        let output;
        try {
            output = await Exec.spawnPromise(command, args);
            console.log(`☑  ${successLog}`, output);
        } catch (error) {
            console.log(`❎  ${errorLog}`);
            if (exit) process.exit(1);
        }
    }

    static spawnPromise(command, args) {
        if (command === 'npm') {
            command = (os.platform() === 'win32') ? 'npm.cmd' : 'npm';
        }
        const promise = (resolve, reject) => {
            const listener = spawnChildProcess(command, args);
            listener.stdout.on('data', (data) => console.log(data.toString()));
            listener.on('error', (data) => {
                reject(new Error(data));
            });
            listener.stderr.on('data', (data) => {
                // this is used by jest and rollup to output logs 😵
                console.log(data.toString());
            });
            listener.on('close', (code) => {
                code !== 1 ? resolve(code) : reject(code);
            });

        }
        return new Promise(promise);
    }
}

module.exports = Exec;
