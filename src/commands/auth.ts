import { saveConfig, clearConfig } from "../config/config.js"
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/git.utils.js"; 
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
        if (error instanceof InvalidRemoteUrlError) {
            logError(error.message);
            process.exit(1);
        }

        if (error instanceof Error) {
            logError(error.message);
            process.exit(1);
        }
    }
}