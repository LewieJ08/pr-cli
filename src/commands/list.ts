import { resolveGithubToken } from "../config/env.js";
import { resolveGitContext } from "../utils/git-context.utils.js";
import { GithubService } from "../services/github.service.js";
import { CLIError } from "../errors/errors.js";
import { logError } from "../utils/logger.utils.js";
import { warn, bold, dim, success, error} from "../utils/color.utils.js";
import { PullRequest } from "../services/github.types.js";

export interface ListOptions {
    all?: boolean;
    state?: 'open' | 'closed';
    sort?: 'created' | 'updated' | 'popularity' | 'long-running';
}

export async function listCommand(options: ListOptions): Promise<void> {
    let pullRequests: PullRequest[];    
    let mergeStatus: string;

    try {
        if (options.all && options.state) {
            throw new Error('You cannot use the --all (-a) flag with the --state flag when running pr list');
        }

        const { owner, repo } = resolveGitContext();    
        const token = resolveGithubToken();
        
        const github = new GithubService({
            token: token, 
            owner: owner, 
            repo: repo
        });

        if (options.all) {
            pullRequests = await github.listPullRequests('all', options.sort);
        } else {
            pullRequests = await github.listPullRequests(options.state, options.sort);
        } 

        if (pullRequests.length === 0) {
            console.log('No Pull Requests')
        }
        
        for (const pullRequest of pullRequests) {
            mergeStatus = pullRequest.merged_at ? success('Merged') : warn('Pending Merge');

            if (pullRequest.state === 'closed' && !pullRequest.merged_at) {
                mergeStatus = error('Not Merged');
            }

            const state = pullRequest.state === 'open' ? 'OPEN' : dim('CLOSED');

            // Header
            console.log(
                bold(`\nPR #${pullRequest.number}`),
                state,
                pullRequest.html_url
            );

            // Title
            console.log(bold(pullRequest.title));

            // Merge status / branches
            console.log(
                mergeStatus,
                dim(pullRequest.base.ref),
                dim('←'),
                dim(pullRequest.head.ref)
            );

            // Metadata 
            console.log(
                dim('Author:'),
                pullRequest.user.login,
                dim('·'),
                dim('Created:'),
                new Date(pullRequest.created_at).toUTCString()
            );

            // Divider
            console.log(dim('─'.repeat(60)));

        }
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