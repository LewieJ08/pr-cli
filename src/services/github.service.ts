import { PullRequest, User, File, Commit, Repository } from "./github.types.js";

interface GithubServiceConfig {
    token: string;
    owner: string;
    repo: string;
}

type ResponseMode = 'json' | 'status';

export class GithubService {
    private readonly baseUrl: string;
    private readonly repoPath: string;

    constructor(private readonly config: GithubServiceConfig) {
        this.baseUrl = `https://api.github.com`;
        this.repoPath = `/repos/${config.owner}/${config.repo}`;
    }

    // Make request to github api
    private async request<T>(
        path: string,
        options:RequestInit,
        mode: ResponseMode = 'json'
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
                'Authorization': `Bearer ${this.config.token}`,
                'Accept': 'application/vnd.github+json',
                ...options.headers
            },
        });

        if (mode === 'status') {
            if (response.status === 204) {
                return true as T;
            }

            if (response.status === 404) {
                return false as T;
            }
        }

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

    // Get a pull request
    public getPullRequest(pullNumber: number): Promise<PullRequest> {
        return this.request<PullRequest>(`${this.repoPath}/pulls/${pullNumber}`, {method: 'GET'})
    }

    // Update a pull request
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

    // List commits of a pull request 
    public listPullRequestCommits(pullNumber: number): Promise<Commit[]> {
        return this.request<Commit[]>(`${this.repoPath}/pulls/${pullNumber}/commits`, {
            method: 'GET'
        })
    }

    // List files of a pull request
    public listPullRequestFiles(pullNumber: number): Promise<File[]> {
        return this.request<File[]>(`${this.repoPath}/pulls/${pullNumber}/files`, {
            method: 'GET'
        })
    }

    // Check if a pull request has been merged
    public checkPullRequestMerged(pullNumber: number): Promise<boolean> {
        return this.request(
            `${this.repoPath}/pulls/${pullNumber}/merge`,
            { method: 'GET' },
            'status'
        )
    }
}