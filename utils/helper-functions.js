import { exec, execSync } from 'node:child_process';
import fs from 'node:fs';

export const createDirectory = async (path) => {
    try {
        fs.mkdirSync(path);
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

export const tryCloneRepo = async (path, outDirectory) => {
    try {
        await execute(`git clone --depth 1 ${path} ${outDirectory}`);
        process.chdir(outDirectory);
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

export const tryInstallDeps = async () => {
    try {
        await execute('npm install');
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

const execute = (command) => new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
        error ? reject(error) : resolve(stdout);
    })
})