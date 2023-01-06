export const exitProcces = (code, messages = []) => {
    for (const message of messages)
        console.log(message);
    process.exit(code);
}