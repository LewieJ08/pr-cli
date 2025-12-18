import chalk from "chalk";

export function logSuccess(message: string): void {
    console.log(chalk.green(message));
}

export function logError(message: string): void {
    console.log(chalk.red(message));
}
