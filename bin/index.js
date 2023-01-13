#!/usr/bin/env node

import path from 'path';

import { generateTemplate } from '../utils/generate.js';
import { exitProcces } from '../utils/exit-process.js';
import messages from '../docs/messages.json' assert { type: "json" };

const targets = {
    react: {
        url: 'https://github.com/sebastien-gervilla/skz-ready-ui',
        rootFolder: 'skz-ready-ui-master'
    },
    vue: {
        url: 'https://github.com/sebastien-gervilla/vue-ready-ui',
        rootFolder: 'vue-ready-ui-master'
    }
};

(async () => {
    const projectName = process.argv[2];
    if (!projectName) exitProcces(1, [messages.fail.missingName])

    let target = targets.react;
    if (process.argv[3] === '--vue')
        target = targets.vue;

    const projectDirectory = path.resolve(process.cwd(), projectName);
    await generateTemplate(projectName, projectDirectory, target);
})();