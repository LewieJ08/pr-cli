import { configDotenv } from "dotenv";
import { loadConfig } from "./config.js";
configDotenv({quiet: true});

// get github token from .env or config file
export function resolveGithubToken(): string {
    const envToken = process.env.GITHUB_TOKEN;
    if (envToken) {
        return envToken;
    }

    const configToken =  loadConfig();
    if (configToken) {
        return configToken;
    }

    throw new Error("Missing Github Token Config. Please run 'pr auth' to authenticate")
}