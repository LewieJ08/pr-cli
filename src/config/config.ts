import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { homedir } from "os";
import { validateGithubToken, TokenValidationResult } from "../utils/gitUtils.js";

const CONFIG_DIR = `${homedir()}/.config/pr-cli/`;
const CONFIG_FILE = `${CONFIG_DIR}/config.json`

export function loadConfig(): string | null { 
    if (!existsSync(CONFIG_DIR)) {
        return null;
    }

    const configData = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
    const token: string | null = configData.GITHUB_TOKEN;

    if (!token) {
        return null;
    }

    return token;
}

export async function saveConfig(token: string): Promise<TokenValidationResult> {
    const tokenValidationResult = await validateGithubToken(token);

    if (!tokenValidationResult.valid) {
        throw new Error('Invalid Github token. Please try again');
    }
    
    const configData = JSON.stringify({
        GITHUB_TOKEN: token
    });

    mkdirSync(CONFIG_DIR, {recursive: true})
    writeFileSync(CONFIG_FILE, configData)

    return tokenValidationResult;
}

export function clearConfig() {
    // pass
}