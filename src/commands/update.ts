import { resolveGithubToken } from "../config/env.js";
import { resolveGitContext } from "../utils/git-context.utils.js";
import { GithubService } from "../services/github.service.js";
import { prompt } from "../utils/prompt.utils.js";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/git.utils.js";
import { logError, logSuccess } from "../utils/logger.utils.js";

async function updateCommand(pullNumber: number): Promise<void> {
    try {
        const context = resolveGitContext();
        const token = resolveGithubToken();
        
        const github = new GithubService({
            token: token, 
            owner: context.owner, 
            repo: context.repo
        });
                                                                
        const pullRequest = await github.getPullRequest(pullNumber);
        const repo = await github.getRepository();
        const title = await prompt('New Title > ');
        const body = await prompt('New Body > ');

        await github.updatePullRequest(
            pullNumber,
            title, 
            body, 
            pullRequest.state,
            repo.default_branch
        );

        logSuccess(`Pull Request for '${repo.name}' updated successfully`);
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
            switch (error.message) {
                case '422':
                    logError('Pull request has been closed');
                    break;
                case '404':
                    logError('Pull Request does not exist');
                    break;
                default:
                    logError(error.message);
                    break;
            }
            process.exit(1);
        }
        
        throw error;
    }
}

export default updateCommand;