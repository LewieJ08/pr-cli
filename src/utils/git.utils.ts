import { execSync } from "child_process";
import { NoGitRepoError, InvalidRemoteUrlError } from "../errors/errors.js";

interface ParsedUrlItems {
    owner: string;
    repo: string;
}

export interface TokenValidationResult {
    valid: boolean;
    reason?: string;
    username?: string;
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
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
            }
        });

        const user = await response.json();

        if (!response.ok) {
            throw new Error('Invalid Github Token');
        }

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