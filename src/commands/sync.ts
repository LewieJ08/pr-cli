import { resolveGitContext } from "../utils/git-context.utils.js";
import { resolveGithubToken } from "../config/env.js";
import { GithubService } from "../services/github.service.js";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/git.utils.js";
import { logError, logSuccess } from "../utils/logger.utils.js";
import { prompt } from "../utils/prompt.utils.js";

async function syncCommand(pullNumber: number) {
    try {
        const context = resolveGitContext();
        const token = resolveGithubToken();
        
        const github = new GithubService({
            token: token, 
            owner: context.owner, 
            repo: context.repo
        });

        const expectedHashSha = await prompt('Enter the latest commit SHA of the pull request branch (HEAD) > ');
        const updated = await github.updatePullRequestBranch(pullNumber, expectedHashSha);

        if (!updated) {
            throw new Error("Unable to sync pull request branch. Use 'pr commits' to find commit SHA")
        }

        logSuccess('Pull Request branch successfully updated and synced')

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

export default syncCommand;