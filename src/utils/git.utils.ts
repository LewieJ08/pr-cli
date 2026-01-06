import { execSync } from "child_process";
import { resolveGitContext } from "./git-context.utils.js";
import { GithubService } from "../services/github.service.js";

interface ParsedUrlItems {
    owner: string;
    repo: string;
}

export interface TokenValidationResult {
    valid: boolean;
    reason?: string;
    username?: string;
}

export class NoGitRepoError extends Error {
    constructor() {
        super('pr: Not a git repository');
        this.name = 'NoGitRepoError';
    }
}

export class InvalidRemoteUrlError extends Error {
    constructor() {
        super('pr: Invalid Remote Git URL');
        this.name = 'InvalidRemoteUrlError';
    }
}

export function getCurrentBranch(): string {
    try {
        return execSync('git rev-parse --abbrev-ref HEAD', {stdio: 'pipe'}).toString().trim();
    } catch {
        throw new NoGitRepoError();
    }
}

export function getRemoteUrl(): string {
    try {
        const url = execSync('git config --get remote.origin.url', {stdio: 'pipe'}).toString().trim();
        const cleaned = url.replace(/\.git$/, '');
        return cleaned;
    } catch {
        throw new NoGitRepoError();
    }
}

export function parseRemoteUrl(remoteUrl: string): ParsedUrlItems {
    const match = remoteUrl.match(/github\.com[:/](.+?)\/(.+)/);
    if (!match) {
        throw new InvalidRemoteUrlError();
    }

    return { owner: match[1], repo: match[2] };
}

export async function validateGithubToken(token: string): Promise<TokenValidationResult> {
    try {
        const context = resolveGitContext();
        const github = new GithubService({
            token: token, 
            owner: context.owner, 
            repo: context.repo
        });

        const user = await github.getUser();

        return {
            valid: true,
            username: user.login
        };

    } catch (error) {
        if (error instanceof Error) {
            return {
                valid: false,
                reason: error.message
            }
        }
        
        throw error;
    }
}