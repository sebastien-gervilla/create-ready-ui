#!/usr/bin/env node

import path from 'path';

import { generateTemplate } from '../utils/generate';
import { exitProcces } from '../utils/exit-process';
import messages from '../docs/messages.json';

(async () => {
    const projectName = process.argv[2];
    if (!projectName) exitProcces(1, [messages.fail.missingName])

    

    const projectDirectory = path.resolve(process.cwd(), projectName);
    await generateTemplate(projectName, projectDirectory);
})();