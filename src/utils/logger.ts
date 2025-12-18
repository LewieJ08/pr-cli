import chalk from "chalk";

export function logSuccess(message: string): void {
    console.log(chalk.green(`\n${message}`));
}

export function logError(message: string): void {
    console.log(chalk.red(`\n${message}`));
}

export function logInfo(message: string): void {
    console.log(chalk.blue(`\n${message}`));
}

export function logWarn(message: string): void {
    console.log(chalk.yellow(`\n${message}`));
}
