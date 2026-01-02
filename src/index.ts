import { Command } from "commander";
import listCommand from "./commands/list.js";
import createCommand from "./commands/create.js";
import getCommand from "./commands/get.js";
import updateCommand from "./commands/update.js";
import commitsCommand from "./commands/commits.js";
import filesCommand from "./commands/files.js";
import { authCommand, AuthOptions } from "./commands/auth.js";

const program = new Command('pr');   

// Core pull request operations
program 
    .description('A cli tool that allows users to create and manage pull requests')
    .version('1.0.0')
    .action(() => {
        program.outputHelp();
    })

program
    .command('list')
    .description('List pull requests')
    .action(() => {
        listCommand();
    })

program
    .command('create')
    .description('Create a pull request')
    .action(() => {
        createCommand();
    })

program 
    .command('get')
    .description('Get a pull request')
    .argument('<pr-number>', 'Pull request number')
    .action((pullNumber: number) => {
        getCommand(pullNumber);
    })

program
    .command('update')
    .description('Update a pull request')
    .argument('<pr-number>', 'Pull request number')
    .action((pullNumber: number) => {
        updateCommand(pullNumber);
    })

// Pull request inspection
program 
    .command('commits')
    .description('List commits on a pull request')
    .argument('<pr-number>', 'Pull request number')
    .action((pullNumber: number) => {   
        commitsCommand(pullNumber);
    })


program 
    .command('files')
    .description('List pull requests files')
    .argument('<pr-number>', 'Pull request number')
    .action((pullNumber: number) => {   
        filesCommand(pullNumber);
    })
    
// Authentication
program
    .command('auth')
    .description('Authenticate GitHub Token (Required)')
    .option('-d, --delete', 'Delete GitHub token from config')
    .action((options: AuthOptions) => {
        authCommand(options);
    })

program.parse();
