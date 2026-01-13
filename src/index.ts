import { Command } from "commander";
import { listCommand, ListOptions } from "./commands/list.js";
import { createCommand, CreateOptions } from "./commands/create.js";
import getCommand from "./commands/get.js";
import updateCommand from "./commands/update.js";
import commitsCommand from "./commands/commits.js";
import filesCommand from "./commands/files.js";
import statusCommand from "./commands/status.js";
import { mergeCommand, MergeOptions } from "./commands/merge.js";
import syncCommand from "./commands/sync.js";
import { authCommand, AuthOptions } from "./commands/auth.js";

const coreGroup = 'Core pull request operations';
const inspectionGroup = 'Pull request inspection';
const actionGroup = 'Pull request actions';

const program = new Command('pr');   

// Core pull request operations
program 
    .description('A cli tool that allows users to create and manage pull requests')
    .version('1.0.4')
    .action(() => {
        program.outputHelp();
    })

program
    .command('list')
    .description('List pull requests')
    .option('-a, --all', 'List all pull requests')
    .option('--state [state]', 'State of pull request (open / closed)')
    .option('--sort [sort]', "Sort pull requests by either 'created', 'updated', 'popularity' or 'long-running'")
    .helpGroup(coreGroup)
    .action((options: ListOptions) => {
        listCommand(options);
    })

program
    .command('create')
    .description('Create a pull request')
    .option('-d, --draft', 'Create a draft pull request')
    .helpGroup(coreGroup)
    .action((options: CreateOptions) => {
        createCommand(options);
    })

program 
    .command('get')
    .description('Get a pull request')
    .helpGroup(coreGroup)
    .argument('<pr-number>', 'Pull request number')
    .action((pullNumber: number) => {
        getCommand(pullNumber);
    })

program
    .command('update')
    .description('Update a pull request')
    .helpGroup(coreGroup)
    .argument('<pr-number>', 'Pull request number')
    .action((pullNumber: number) => {
        updateCommand(pullNumber);
    })

// Pull request inspection
program 
    .command('commits')
    .description('List commits on a pull request')
    .helpGroup(inspectionGroup)
    .argument('<pr-number>', 'Pull request number')
    .action((pullNumber: number) => {   
        commitsCommand(pullNumber);
    })


program 
    .command('files')
    .description('List pull requests files')
    .helpGroup(inspectionGroup)
    .argument('<pr-number>', 'Pull request number')
    .action((pullNumber: number) => {   
        filesCommand(pullNumber);
    })

program 
    .command('status')
    .description('Check if a pull request has been merged')
    .helpGroup(inspectionGroup)
    .argument('<pr-number>', 'Pull request number')
    .action((pullNumber: number) => {   
        statusCommand(pullNumber);
    })

// Pull request actions
program
    .command('merge')
    .description('Merge a pull request')
    .option('-m, --method [merge-method]', 'Merge method (merge / squash / rebase)')
    .helpGroup(actionGroup)
    .argument('<pr-number>', 'Pull request number')
    .action((pullNumber: number, options: MergeOptions) => {
        mergeCommand(pullNumber, options)
    })

program
    .command('sync')
    .description('Update a pull request branch')
    .helpGroup(actionGroup)
    .argument('<pr-number>', 'Pull request number')
    .action((pullNumber: number) => {
        syncCommand(pullNumber)
    })

    
// Authentication
program
    .command('auth')
    .description('Authenticate GitHub Token (Required)')
    .helpGroup('Authentication / Login')
    .option('-d, --delete', 'Delete GitHub token from config')
    .action((options: AuthOptions) => {
        authCommand(options);
    })

program.parse();
