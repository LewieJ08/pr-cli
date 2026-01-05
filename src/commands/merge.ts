import { GithubService } from "../services/github.service.js";
import { resolveGitContext } from "../utils/git-context.utils.js";
import { resolveGithubToken } from "../config/env.js";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/git.utils.js";
import { logError } from "../utils/logger.utils.js";

async function mergeCommand(pullNumber: number): Promise<void> {
    try {
        const context = resolveGitContext();
        const token = resolveGithubToken();
        
        const github = new GithubService({
            token: token, 
            owner: context.owner, 
            repo: context.repo
        });

        await github.mergePullRequest(pullNumber);
        console.log(`Pull Request #${pullNumber} successfully merged`);
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

export default mergeCommand;