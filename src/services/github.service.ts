export interface User {
    id: number;
    login: string; // Username
    email: string;
}

export interface Repository {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    default_branch: string;
}

export interface PullRequest {
    id: number;
    html_url: string;
    number: number;
    state: 'open' | 'closed';
    title: string;
    user: User;
    body?: string;
    created_at: string;
    head: {
        ref: string;
    }
    base: {
        ref: string;
    }
    merged: boolean;
}

export interface GithubServiceConfig {
    token: string;
    owner: string;
    repo: string;
}

export class GithubService {
    private readonly baseUrl: string;
    private readonly repoPath: string;

    constructor(private readonly config: GithubServiceConfig) {
        this.baseUrl = `https://api.github.com`;
        this.repoPath = `/repos/${config.owner}/${config.repo}`;
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

    // Get a User
    public getUser(): Promise<User> {
        return this.request<User>(`/user`, {method: 'GET'}) 
    }

    // Get repository
    public getRepository(): Promise<Repository>{
        return this.request<Repository>(this.repoPath, {method: 'GET'});     
    }

    // List pull requests
    public listPullRequests(): Promise<PullRequest[]> {
        return this.request<PullRequest[]>(`${this.repoPath}/pulls`, {method: 'GET'});
    }

    // Create a pull request
    public createPullRequest(
        title: string,
        body: string,
        head: string,
        base: string,
    ) {
        return this.request(`${this.repoPath}/pulls`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ title, body, head, base })
        })
    }

    public getPullRequest(pullNumber: number): Promise<PullRequest> {
        return this.request<PullRequest>(`${this.repoPath}/pulls/${pullNumber}`, {method: 'GET'})
    }

    public updatePullRequest(
        pullNumber: number,
        title: string,
        body: string,
        state: 'open' | 'closed',
        base: string,
    ) {
        return this.request(`${this.repoPath}/pulls/${pullNumber}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ title, body, state, base })
        })
    }
}