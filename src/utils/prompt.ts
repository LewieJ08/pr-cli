import readline from "node:readline";

export function prompt(query: string): Promise<string> {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(query, answer => {
            rl.close();
            resolve(answer)
        });
    });
}
