import { resolveGithubToken } from "../config/env.js";
import { resolveGitContext } from "../utils/gitContext.js";
import { GithubService } from "../services/githubService.js";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/gitUtils.js";
import { logError, logWarn } from "../utils/logger.js";
import { info } from "../utils/color.js";

async function listCommand(): Promise<void> {
    try {
        const { owner, repo } = resolveGitContext();    
        const token = resolveGithubToken();
        
        const github = new GithubService({
            token: token, 
            owner: owner, 
            repo: repo
        });

        const pullRequests = await github.listPullRequests();
        
        for (const pullRequest of pullRequests) {
            const mergeStatus = pullRequest.merged ? 'Merged' : 'Pending Merge';

            logWarn(`Pull Request #${pullRequest.number} (${pullRequest.state}) ${pullRequest.html_url}`);
            console.log(`${info(mergeStatus)} ${pullRequest.base.ref} <- ${pullRequest.head.ref}`);
            console.log(`Author: ${pullRequest.user.login}`);
            console.log(`Date: ${pullRequest.created_at}`);

            console.log(`\n    ${pullRequest.title}\n`);
        }
    
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

export default listCommand;