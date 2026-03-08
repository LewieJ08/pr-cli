import { saveConfig, clearConfig } from "../config/config.js"
import { CLIError } from "../errors/errors.js"; 
import { logError, logSuccess, logInfo } from "../utils/logger.utils.js";
import { prompt } from "../utils/prompt.utils.js";

export interface AuthOptions{
    delete?: boolean
}

export async function authCommand(options: AuthOptions) {
    try {
        if (options.delete) {
            clearConfig();
            logInfo("Config cleared. See 'pr auth -h' for config options")
        } else {
            const token = await prompt('Github Token> ')
            const tokenData = await saveConfig(token);
            logSuccess(`Github token for user '${tokenData.username}' authenticated successfully`);
        }
    } catch (error: unknown) {
        if (error instanceof CLIError) {
            logError(error.message);
            process.exit(error.exitCode);
        }

        if (error instanceof Error) {
            logError(error.message);
            process.exit(1);
        }

        throw error;
    }
}