const Exec = require('./exec');
const version = require('../package.json').version;

class PackageVersion {
    static async compare() {
        // DELETE LOCAL TAGS
        const tags = await Exec.execute({
            command: 'git tag | xargs git tag -d',
            successLog: 'git: deleted tags',
            errorLog: 'git: could not delete tags'
        });

        // CHECK FOR TAGS THAT EXIST FOR THE PROPOSED RELEASE VERSION
        await Exec.execute({
            command: 'git fetch --tags',
            successLog: 'git: fetched tags',
            errorLog: 'git: could not fetch tags',
            exit: true
        });

        let output = await Exec.execute({
            command: 'git tag -l',
            successLog: 'git: find tags',
            errorLog: 'git: could not list tags'
        });

        output = output.split('\n');

        let currentTag = await Exec.execute({
            command: 'git describe --tags',
            successLog: 'git: describe',
            errorLog: 'git: could not describe',
            exit: false
        });

        console.log(`Current tag ${currentTag}`);

        if (output.find(element => element === version)) {
            if (currentTag.indexOf('-') !== -1) {
                // we are not on a tag
                console.log(`❗ ${version} is already tagged, please increment version, add to CHANGELOG and try again ❗`);
                process.exit(1);
            } else {
                console.log(`✅  ${version} exists, but we are building a release tag. Proceeding with build...`);
            }
        } else {
            console.log(`✅  ${version} does not already exist, proceed with build`);
        }
    }
}

module.exports = PackageVersion;
