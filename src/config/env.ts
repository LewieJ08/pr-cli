import { configDotenv } from "dotenv";
configDotenv({quiet: true});

// GitHub api token
export const TOKEN = process.env.TOKEN || undefined;