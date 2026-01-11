import { resolveGithubToken } from "../config/env.js";
import { resolveGitContext } from "../utils/git-context.utils.js";
import { GithubService } from "../services/github.service.js";
import { prompt } from "../utils/prompt.utils.js";
import { NoGitRepoError, InvalidRemoteUrlError } from "../utils/git.utils.js";
import { logError, logSuccess } from "../utils/logger.utils.js";

export interface CreateOptions { 
    draft: boolean;
}

export async function createCommand(options: CreateOptions): Promise<void> {
    try {
        const context = resolveGitContext();
        const token = resolveGithubToken();
        
        const github = new GithubService({
            token: token, 
            owner: context.owner, 
            repo: context.repo
        });

        const repo = await github.getRepository();
        const title = await prompt('PR Title > ');
        const body = await prompt('PR Body > ');

        const created = await github.createPullRequest(
            title, 
            body, 
            context.head,
            repo.default_branch
        );

        if (!created) {
            throw new Error('Unable to create pull request. Remember to push your changes\nIf this does not work please refer to docs')
        }

        logSuccess(`\nPull Request #${created.number} for '${repo.name}' created successfully`);
        console.log(created.html_url);
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
            if (error.message === '422') {
                logError('Unable to create pull request. Ensure to push recent changes.');
                logError('You cannot create a pull request if there is one already open on the current branch');
            }
            process.exit(1);
        }
        
        throw error;
    }
}
