import { resolveGithubToken } from "../config/env";
import { resolveGitContext } from "../utils/gitContext";
import { GithubService } from "../services/githubService";
import { prompt } from "../utils/prompt";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/gitUtils";

async function createCommand(): Promise<void> {
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

        github.createPullRequest(
            title, 
            body, 
            context.head,
            repo.default_branch
        );

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

export default createCommand;
