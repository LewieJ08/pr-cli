import { Command } from "commander";
import listPullRequests from "./commands/list";
import createPullRequest from "./commands/create";

const program = new Command();        

program 
    .option('-l, --list', 'list all pull requests')
    .option('-c, --create', 'create new pull request')

program.parse(process.argv);
const options = program.opts();

if (options.list) listPullRequests();
if (options.create) createPullRequest();