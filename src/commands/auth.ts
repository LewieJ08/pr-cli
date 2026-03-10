import { loadConfig, saveConfig, clearConfig } from "../config/config.js"
import { CLIError } from "../errors/errors.js"; 
import { logError, logSuccess, logInfo } from "../utils/logger.utils.js";
import { prompt } from "../utils/prompt.utils.js";

export interface AuthOptions{
    delete?: boolean
    status?: boolean
}

export async function authCommand(options: AuthOptions) {
    try {
        if (options.delete) {
            clearConfig();
            logInfo("Github token deleted and config cleared. Use 'pr auth -h' for auth options")
            process.exit(1);
        }

        if (options.status) {
            const isAuthenticated = loadConfig() ? true : false;
            isAuthenticated 
                ? logSuccess('GitHub token authenticated and stored in config file') 
                : logError(`GitHub token not authenticated. Use 'pr auth -h' for auth options`)
            process.exit(1)
        }

        const token = await prompt('Github Token> ')
        const tokenData = await saveConfig(token);
        logSuccess(`Github token for user '${tokenData.username}' authenticated successfully`);
     
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