import chalk, { ChalkInstance } from "chalk";

interface LogOptions {
    bold?: boolean;
    dim?: boolean;
    italic?: boolean;
    underline?: boolean;
    inverse?: boolean;
}

// Applies formatting options to base ChalkInstance
function applyLogOptions(base: ChalkInstance, options?: LogOptions): ChalkInstance {
    let style = base;

    if (options?.bold) style = style.bold;
    if (options?.dim) style = style.dim;
    if (options?.italic) style = style.italic;
    if (options?.underline) style = style.underline;
    if (options?.inverse) style = style.inverse;

    return style;
}

// Main log function
function log( message: string, base: ChalkInstance, options?: LogOptions ): void {
    const chalkInstance = applyLogOptions(base, options);
    console.log(chalkInstance(`${message}`));
}

// Public log functions
export function logSuccess(message: string, options?: LogOptions): void {
    log(message, chalk.green, options);
}

export function logError(message: string, options?: LogOptions): void {
    log(message, chalk.red, options);
}

export function logInfo(message: string, options?: LogOptions): void {
    log(message, chalk.blue, options);
}

export function logWarn(message: string, options?: LogOptions): void {
    log(message, chalk.yellowBright, options);
}

export function logText(message: string, options?: LogOptions): void {
    log(message, chalk, options);
}