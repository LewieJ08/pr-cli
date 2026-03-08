import { resolveGithubToken } from "../config/env.js";
import { GithubService } from "../services/github.service.js";
import { resolveGitContext } from "../utils/git-context.utils.js";
import { logError } from "../utils/logger.utils.js";
import { success, error } from "../utils/color.utils.js";
import { CLIError } from "../errors/errors.js";

async function statusCommand(pullNumber: number) {
    try {
        const context = resolveGitContext();
        const token = resolveGithubToken();

        const github = new GithubService({
            token: token,
            repo: context.repo,
            owner: context.owner
        });
        await github.getPullRequest(pullNumber);
        const merged = await github.checkPullRequestMerged(pullNumber);
        const mergeStatus = merged ? success('Merged') : error('Not Merged');

        console.log(`Pull Request #${pullNumber}`);
        console.log(`Merge Status: ${mergeStatus}`);

    } catch (error: unknown) {
       if (error instanceof CLIError) {
            logError(error.message);
            process.exit(error.exitCode);
        }

        if (error instanceof Error) {
            if (error.message === '404') {
                logError('Pull request does not exist');
            } else {
                logError(error.message);
            }
            process.exit(1);
        }
        
        throw error;
    }
    
}

export default statusCommand;