import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/gitUtils.js"
import { logError, logWarn} from "../utils/logger.js"
import { info } from "../utils/color.js";
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
        const mergeStatus = pullRequest.merged ? 'Merged' : 'Pending Merge'

        // Display pull request data in clean format
        logWarn(`Pull Request #${pullRequest.number} (${pullRequest.state}) ${pullRequest.html_url}`);
        console.log(`${info(mergeStatus)} ${pullRequest.base.ref} <- ${pullRequest.head.ref}`);
        console.log(`Author: ${pullRequest.user.login}`);
        console.log(`Date: ${pullRequest.created_at}`);

        console.log(`\n----${pullRequest.title}----\n`);
        console.log(`${pullRequest.body}\n`);

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