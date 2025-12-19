import { resolveGithubToken } from "../config/env.js";
import { resolveGitContext } from "../utils/gitContext.js";
import { GithubService } from "../services/githubService.js";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/gitUtils.js";
import { logError } from "../utils/logger.js";

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
            console.log(pullRequest.title)
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