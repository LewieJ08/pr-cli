import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { homedir } from "os";
import { validateGithubToken, TokenValidationResult } from "../utils/git.utils.js";

const CONFIG_DIR = `${homedir()}/.config/pr-cli`;
const CONFIG_FILE = `${CONFIG_DIR}/config.json`

export function loadConfig(): string | null { 
    if (!existsSync(CONFIG_DIR)) {
        return null;
    }

    const configData = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
    const token: string | null = configData.githubToken;

    if (!token) {
        return null;
    }

    return token;
}

export async function saveConfig(token: string): Promise<TokenValidationResult> {
    const tokenValidationResult = await validateGithubToken(token);

    if (!tokenValidationResult.valid && tokenValidationResult.reason !== 'pr: Not a git repository') {
        throw new Error(tokenValidationResult.reason);
    }
    
    const configData = JSON.stringify({
        githubToken: token
    });

    mkdirSync(CONFIG_DIR, {recursive: true});
    writeFileSync(CONFIG_FILE, configData);

    return tokenValidationResult;
}

export function clearConfig() {
    const configData = JSON.stringify({
        githubToken: null
    });

    writeFileSync(CONFIG_FILE, configData);
}