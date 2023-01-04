export const exitProcces = (code: number, messages: Array<string>) => {
    for (const message of messages)
        console.log(message);
    process.exit(code);
}