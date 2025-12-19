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
    title: string;
    user: User;
    created_at: string;
    head: {
        ref: string;
    }
    base: {
        ref: string;
    }
}