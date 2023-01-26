import { exec } from 'node:child_process';
import { emptyDir, pathExists } from 'fs-extra';
import { cp, readdir, rm, rmdir } from 'node:fs/promises';

export const isGitInstalled = async () => {
    try {
        await execute('git --version');
    } catch (error) {
        return false;
    }
    return true;
}

export const tryCloneRepo = async (giturl, outDirectory) => {
    try {
        await execute(`git clone --depth 1 ${giturl} ${outDirectory}`);
        process.chdir(outDirectory);
        await emptyDir('./.git');
        await rmdir('./.git');
        await rm('./README.md');
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

export const tryFindConflict = async (tempDir, outDir) => {
    try {
        const files = await readdir(tempDir);
        for (const file of files)
            if (await pathExists(outDir + '/' + file))
                return file;
    } catch (error) {
        console.log(error);
        return '/';
    }
    return false;
}

export const tryMoveFiles = async (tempDir, outDir) => {
    try {
        await cp(tempDir, outDir, {
            recursive: true
        });
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

export const tryInstallDeps = async (outDir) => {
    try {
        await execute('npm install --prefix ' + outDir);
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

const execute = (command) => new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
        error ? reject(error) : resolve(stdout);
    })
})