import { resolveGitContext } from "../utils/git-context.utils.js";
import { resolveGithubToken } from "../config/env.js";
import { GithubService } from "../services/github.service.js";
import { CLIError } from "../errors/errors.js";
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

        const expectedHashSha = await prompt('Enter the latest commit SHA (hash) of the pull request branch (HEAD) > ');
        const updated = await github.updatePullRequestBranch(pullNumber, expectedHashSha);

        if (!updated) {
            throw new Error("Unable to sync pull request branch. Use 'pr commits' to find latest commit SHA\nPull request may already be merged/closed");
        }

        logSuccess('Pull Request branch successfully updated and synced');

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

export default syncCommand;