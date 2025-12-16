import { TOKEN } from "../config/env";
import { resolveGitContext } from "../utils/gitContext";
import { GithubService } from "../services/githubService";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/gitUtils";

async function listCommand(): Promise<void> {
    try {
        const { owner, repo } = resolveGitContext();
        const github = new GithubService({
            token: TOKEN, 
            owner: owner, 
            repo: repo
        });

        const pullRequests = await github.listPullRequests();
        console.log(pullRequests);
    } catch (error) {
        if (error instanceof NoGitRepoError) {
            console.log(error.message);
            process.exit(1);
        }

        if (error instanceof InvalidRemoteUrlError) {
            console.log(error.message);
            process.exit(1);
        }
        
        throw error;
    }
}

export default listCommand;