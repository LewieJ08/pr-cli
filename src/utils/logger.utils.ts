import * as c from './color.utils.js';

// Helper log functions
export function logSuccess(message: string): void {
    console.log(c.success(message));
}

export function logError(message: string): void {
    console.log(c.error(message));
}

export function logInfo(message: string, ): void {
    console.log(c.info(message));
}

export function logWarn(message: string, ): void {
    console.log(c.warn(message));
}
