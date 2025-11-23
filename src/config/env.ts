import { configDotenv } from "dotenv";
configDotenv({quiet: true});

export const REPO = process.env.REPO || undefined;
export const OWNER = process.env.OWNER || undefined;
export const TOKEN = process.env.TOKEN || undefined;