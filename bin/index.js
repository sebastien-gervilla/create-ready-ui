#!/usr/bin/env node

import path from 'path';

import { generateTemplate } from '../utils/generate.js';
import { exitProcces } from '../utils/exit-process.js';
import messages from '../docs/messages.json' assert { type: "json" };

(async () => {
    const projectName = process.argv[2];
    if (!projectName) exitProcces(1, [messages.fail.missingName])

    const projectDirectory = path.resolve(process.cwd(), projectName);
    await generateTemplate(projectName, projectDirectory);
})();