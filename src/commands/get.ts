import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/gitUtils.js"
import { logError, logWarn, logText } from "../utils/logger.js"
import { GithubService } from "../services/githubService.js";
import { resolveGitContext } from "../utils/gitContext.js";
import { resolveGithubToken } from "../config/env.js";

async function getCommand(pullNumber: number): Promise<void> {
    try {
        const context = resolveGitContext();
        const token = resolveGithubToken();

        const github = new GithubService({
            token: token,
            owner: context.owner,
            repo: context.repo,
        });

        const pullRequest = await github.getPullRequest(pullNumber);

        // Display pull request data in clean format
        logWarn(`Pull Request #${pullRequest.number}  ${pullRequest.html_url}`, { bold: true });
        console.log(`Author: ${pullRequest.user.login}`);
        console.log(`Date: ${pullRequest.created_at}`);
        console.log(`${pullRequest.head.ref} --> ${pullRequest.base.ref}`);
        logText(`\n    ${pullRequest.title}\n`, { bold: true });

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

export default getCommand