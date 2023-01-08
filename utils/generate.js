import ora from 'ora';
import chalk from 'chalk';

import { 
    createDirectory, 
    tryCloneRepo, 
    tryInstallDeps
} from './helper-functions.js';
import { exitProcces } from './exit-process.js';

import messages from '../docs/messages.json' assert { type: "json" };

const target = {
    url: 'https://github.com/sebastien-gervilla/skz-ready-ui',
    rootFolder: 'create-ready-ui-master',
};

const spinner = ora({ text: '' });
export const generateTemplate = async (newProjectPath, outDirectory) => {

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

    spinner.text = 'Downloading files...';
    const cloneSuccess = await tryCloneRepo(target.url, outDirectory);
    if (!cloneSuccess) {
        spinner.fail(chalk.red(messages.fail.cloneError));
        exitProcces(3);
    }

    spinner.text = 'Installing dependencies...';
    const depsSuccess = await tryInstallDeps();
    if (!depsSuccess) {
        spinner.fail(chalk.red(messages.fail.depsError));
        exitProcces(4);
    }
    
    spinner.succeed(chalk.green(messages.success.created));
}