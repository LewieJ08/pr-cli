import { resolveGithubToken } from "../config/env.js";
import { resolveGitContext } from "../utils/gitContext.js";
import { GithubService } from "../services/githubService.js";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/gitUtils.js";
import { logError, logText, logWarn } from "../utils/logger.js";

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

            logWarn(`Pull Request #${pullRequest.number} (${pullRequest.state}) ${pullRequest.html_url}`, { bold: true });
            console.log(`${pullRequest.head.ref} --> ${pullRequest.base.ref} (${mergeStatus})`);
            console.log(`Author: ${pullRequest.user.login}`);
            console.log(`Date: ${pullRequest.created_at}`);

            logText(`\n    ${pullRequest.title}\n`, { bold: true });
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