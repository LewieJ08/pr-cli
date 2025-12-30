import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/git.utils.js";
import { logError } from "../utils/logger.utils.js";
import { GithubService } from "../services/github.service.js";

async function commitsCommand(): Promise<void> {
    try {

    } catch (error: unknown) {
        if (error instanceof NoGitRepoError) {
            logError(error.message);
            process.exit(1);
        }

        if (error instanceof InvalidRemoteUrlError) {
            logError(error.message);
            process.exit(1);
        }

        if (error instanceof Error) {
            logError(error.message);
            process.exit(1);
        }

        throw error;
    }
}