const Exec = require('./exec');
const version = require('../package.json').version;
const PackageVersion = require('./package-version');

const sequence = async () => {
    let output;

    await PackageVersion.compare();

    // BUILD
    await Exec.spawn({
        command: 'npm',
        args: ['run', 'build'],
        successLog: 'build successful',
        errorLog: 'build unsuccessful'
    });

    // TAG
    await Exec.execute({
        command: `git tag -a ${version} -m "🔖 ${version}"`,
        successLog: `🔖 tagged ${version} 🔖`,
        errorLog: `${version} tag already exists`
    });

    // PUSH TAG
    await Exec.execute({
        command: 'git push origin --tags',
        successLog: 'pushed tag ➡🔖',
        errorLog: 'could not push tag'
    });

    console.log('😀  complete');
}

sequence();
