import { configDotenv } from "dotenv";
configDotenv({quiet: true});

// fetch env vars
function fetchEnvVar(name: string): string {
    const value = process.env[name];

    if (!value) {
        console.log(`Missing required environment variable: ${name}`);
        process.exit(1)
    }

    return value;
}

export const TOKEN = fetchEnvVar('TOKEN');