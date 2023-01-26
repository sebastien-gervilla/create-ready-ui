import ora from 'ora';
import chalk from 'chalk';
import { temporaryDirectory } from 'tempy';

import { 
    isGitInstalled, 
    tryCloneRepo, 
    tryFindConflict, 
    tryInstallDeps,
    tryMoveFiles
} from './helper-functions.js';
import { exitProcces } from './exit-process.js';

import messages from '../docs/messages.json' assert { type: "json" };

const spinner = ora({ text: '' });
const ERROR = chalk.red('ERROR : ');

export const generateTemplate = async (outDirectory, target) => {

    spinner.start(messages.info.downloading);
    const gitSuccess = await isGitInstalled();
    if (!gitSuccess) {
        spinner.fail(ERROR + messages.fail.gitFailed);
        exitProcces(1);
    }

    const tempDir = temporaryDirectory();
    const cloneSuccess = await tryCloneRepo(target.url, tempDir);
    if (!cloneSuccess) {
        spinner.fail(ERROR + messages.fail.cloneError);
        exitProcces(2);
    }

    spinner.text = messages.info.conflicts;
    const conflitingFile = await tryFindConflict(tempDir, outDirectory);
    if (conflitingFile) {
        spinner.fail(ERROR + messages.fail.conflictError + chalk.blue(conflitingFile));
        exitProcces(3);
    }

    spinner.text = messages.info.importing;
    const moveSuccess = await tryMoveFiles(tempDir, outDirectory);
    if (!moveSuccess) {
        spinner.fail(ERROR + messages.fail.movingError);
        exitProcces(4);
    }

    spinner.text = messages.info.installDeps;
    const depsSuccess = await tryInstallDeps(outDirectory);
    if (!depsSuccess) {
        spinner.fail(ERROR + messages.fail.depsError);
        exitProcces(5);
    }
    
    spinner.succeed(chalk.green(messages.success.created));
}