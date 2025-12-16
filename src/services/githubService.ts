import { Repository } from "./types";

export interface GithubServiceConfig {
    token: string;
    owner: string;
    repo: string;
}

export class GithubService {
    private readonly baseUrl: string;

    constructor(private readonly config: GithubServiceConfig) {
        this.baseUrl = `https://api.github.com/repos/${config.owner}/${config.repo}`;
    }

    // Make request to github api
    private async request<T>(path: string, options: RequestInit): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
                'Authorization': `Bearer ${this.config.token}`,
                'Accept': 'application/vnd.github+json',
                ...options.headers
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`GitHub API error ${response.status}: ${data?.message ?? 'Unknown error'}`)
        }
        
        return data
    }

    // Get repository
    public getRepository(): Promise<Repository>{
        return this.request<Repository>('', {method: 'GET'});     
    }

    // List pull requests
    public listPullRequests() {
        return this.request('/pulls', {method: 'GET'});
    }

    // Create a pull request
    public createPullRequest(
        title: string,
        body: string,
        head: string,
        base: string,
    ) {
        return this.request('/pulls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ title, body, head, base })
        })
    }
}