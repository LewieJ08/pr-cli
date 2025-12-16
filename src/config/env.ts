import { configDotenv } from "dotenv";
configDotenv({quiet: true});

// get github token env var
export function resolveGithubToken(): string {
    if (process.env.GITHUB_TOKEN) {
        return process.env.GITHUB_TOKEN
    }

    throw new Error("Missing Github Token Config. Please run 'pr auth login' to authenticate")
}