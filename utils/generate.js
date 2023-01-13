import ora from 'ora';
import chalk from 'chalk';

import { 
    createDirectory, 
    tryCloneRepo, 
    tryInstallDeps
} from './helper-functions.js';
import { exitProcces } from './exit-process.js';

import messages from '../docs/messages.json' assert { type: "json" };

const spinner = ora({ text: '' });
export const generateTemplate = async (newProjectPath, outDirectory, target) => {

    spinner.start('Creating template...');
    if (newProjectPath !== '.') {
        const createSucces = await createDirectory(newProjectPath);
        if (!createSucces) {
            spinner.fail(chalk.red(messages.fail.mkdirError));
            exitProcces(2, [
                console.log(messages.help.folderMayExist + chalk.grey.underline(outDirPath)),
                console.log(messages.help.tryRemoveFolder)
            ]);
        }
    }

    if (newProjectPath === '.' && outDirectory.includes(' ')) {
        spinner.fail(chalk.red(messages.fail.wrongDirName));
        exitProcces(3);
    }

    spinner.text = 'Downloading files...';

    const gitSuccess = await isGitInstalled();
    if (!gitSuccess) {
        spinner.fail(chalk.red(messages.fail.gitFailed));
        exitProcces(3);
    }

    const cloneSuccess = await tryCloneRepo(target.url, outDirectory);
    if (!cloneSuccess) {
        spinner.fail(chalk.red(messages.fail.cloneError));
        exitProcces(4);
    }

    spinner.text = 'Installing dependencies...';
    const depsSuccess = await tryInstallDeps();
    if (!depsSuccess) {
        spinner.fail(chalk.red(messages.fail.depsError));
        exitProcces(5);
    }
    
    spinner.succeed(chalk.green(messages.success.created));
}