import { REPO, OWNER, TOKEN } from "../config/env";

const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;

// List pull requests
export async function listPullRequests(): Promise<void> {
    try {
        const response = await fetch(`${API_BASE}/${OWNER}/${REPO}/pulls`, {
            method: 'GET',
            headers: {'X-GitHub-Api-Version': '2022-11-28'}
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        console.log(data)

    } catch(error: unknown) {
        throw error;
    }
}

// Create a pull request
export async function createPullRequest(
    title: string, 
    body: string, 
    head: string, 
    base: string
): Promise<void> {
    try {
        const response = await fetch(`${API_BASE}/pulls`, {
            method: 'POST',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
                'Authorization': `Bearer ${TOKEN}`,
                'Accept': 'application/vnd.github+json',
                'Content': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                body: body,
                head: head,
                base: base
            })
        });

        const data = await response.json()

        if (!response.ok) {
            throw new Error (`${response.status}`);
        }

        console.log(data);

    } catch(error: unknown) {
        throw error
    }
}

export default createPullRequest;