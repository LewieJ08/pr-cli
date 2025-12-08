import { Command } from "commander";
import listPullRequests from "./commands/list";
import createPullRequest from "./commands/create";

export const program = new Command();        

program 
    .name('pr')
    .description('A cli tool that allows users to create and manage pull requests')
    .option('-l, --list', 'List pull requests')
    .option('-c, --create', 'Create a pull request')

program.parse(process.argv);
const options = program.opts();

if (options.list) listPullRequests();
if (options.create) createPullRequest();