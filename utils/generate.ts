import path from 'node:path';
import tempy from 'tempy';
import ora from 'ora';
import chalk from 'chalk';
import { execa } from 'execa';

import { 
    downloadFile, 
    extractTemplate, 
    tryRenameFile 
} from './file-functions';

const target = {
    url: 'https://github.com/sebastien-gervilla/ready-ui/archive/refs/heads/master.tar.gz',
    rootFolder: 'start-ui-web-master',
};

const spinner = ora({ text: '' });
export const generateTemplate = async (projectName: string, outDirPath: string) => {
    spinner.start('Downloading template...');

    // Download zip
    const tempFilePath = await downloadFile(target.url);

    if (!tempFilePath) {
        spinner.fail(
            chalk.red('Cannot download template from repository. Make sure your connection is ok.')
        )
        process.exit(1);
    }

    spinner.text = `Extracting template into ${outDirPath}`;
    const tempDir = tempy.temporaryDirectory();

    const success = await extractTemplate(tempDir, tempFilePath);
    if (!success) {
        spinner.fail(
            chalk.red('An error occured while extracting the template archive.')
        );
        console.log(
            `This folder may already exists: ${chalk.grey.underline(outDirPath)}`
        );
        console.log('If this is the case, try removing it.');
        process.exit(2);
    }

    const tempTemplateDir = path.join(tempDir, target.rootFolder);
    const renameSuccess = await tryRenameFile(tempTemplateDir, outDirPath);
    if (!renameSuccess) {
        spinner.fail(chalk.red('An error occured while moving files.'));
        process.exit(3);
    }

    process.chdir(outDirPath);

    spinner.text = 'Initializing empty repository...';
    await execa('git', ['init']);

    spinner.text = 'Installing dependencies...';
    await execa('npm', ['install']);

    spinner.succeed(
        `${chalk.green(' Project created and dependencies installed! ')}`
    );

    console.log(`Created ${projectName} at ${outDirPath}`);
    console.log('');
    console.log('You can now run these commands to start using it:');
    console.log('');
    console.log(`  ${chalk.cyan(`cd ${chalk.white(projectName)}`)}`);
    console.log(`  ${chalk.cyan('npm run dev')}`);
    console.log('');
};