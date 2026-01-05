import { resolveGithubToken } from "../config/env.js";
import { GithubService } from "../services/github.service.js";
import { resolveGitContext } from "../utils/git-context.utils.js";
import { logError } from "../utils/logger.utils.js";
import { success, error } from "../utils/color.utils.js";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/git.utils.js";

async function statusCommand(pullNumber: number) {
    try {
        const context = resolveGitContext();
        const token = resolveGithubToken();

        const github = new GithubService({
            token: token,
            repo: context.repo,
            owner: context.owner
        });
        
        const merged = await github.checkPullRequestMerged(pullNumber);
        const mergeStatus = merged ? success('Merged') : error('Not Merged');

        console.log(`Pull Request #${pullNumber}`);
        console.log(`Merge Status: ${mergeStatus}`);

    } catch (error) {
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

export default statusCommand;