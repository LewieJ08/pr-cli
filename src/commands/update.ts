import { resolveGithubToken } from "../config/env.js";
import { resolveGitContext } from "../utils/gitContext.js";
import { GithubService } from "../services/githubService.js";
import { prompt } from "../utils/prompt.js";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/gitUtils.js";
import { logError, logSuccess } from "../utils/logger.js";

async function updateCommand(): Promise<void> {
    try {
        const context = resolveGitContext();
        const token = resolveGithubToken();
        
        const github = new GithubService({
            token: token, 
            owner: context.owner, 
            repo: context.repo
        });

        const repo = await github.getRepository();
        const title = await prompt('title > ');
        const body = await prompt('body > ');

        await github.updatePullRequest(
            title, 
            body, 
            context.head, // TODO replace with state and get state from github.getPullRequest
            repo.default_branch
        );

        logSuccess(`Pull Request for '${repo.name}' updated successfully`);
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

export default updateCommand;