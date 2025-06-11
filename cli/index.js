#!/usr/bin/env node

const { Command } = require('commander');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const program = new Command();

program
  .name('polkaforge')
  .description('PolkaForge CLI - Decentralized GitHub on Polkadot')
  .version('1.0.0');

// Open PolkaForge DApp
program
  .command('open')
  .description('Open PolkaForge DApp in browser')
  .action(() => {
    console.log('🌐 Opening PolkaForge DApp...');
    const url = 'http://localhost:3000';
    
    // Open browser based on platform
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    spawn(start, [url], { stdio: 'ignore', detached: true }).unref();
    console.log(`✅ PolkaForge opened at ${url}`);
  });

// Repository commands
const repoCommand = program
  .command('repo')
  .description('Repository management commands');

repoCommand
  .command('create')
  .description('Create a new repository')
  .option('-n, --name <name>', 'Repository name')
  .option('-d, --description <description>', 'Repository description')
  .option('-p, --private', 'Create private repository')
  .action((options) => {
    console.log('📁 Creating new repository...');
    
    if (!options.name) {
      console.log('❌ Repository name is required');
      console.log('Usage: polkaforge repo create -n <name> [-d <description>] [-p]');
      return;
    }

    console.log(`✅ Repository "${options.name}" creation initiated`);
    console.log('📱 Opening repository creation form in browser...');
    
    const params = new URLSearchParams({
      name: options.name,
      description: options.description || '',
      private: options.private ? 'true' : 'false'
    });
    
    const url = `http://localhost:3000/create?${params.toString()}`;
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    spawn(start, [url], { stdio: 'ignore', detached: true }).unref();
  });

repoCommand
  .command('list')
  .description('List all repositories')
  .action(() => {
    console.log('📋 Listing repositories...');
    console.log('📱 Opening repositories list in browser...');
    
    const url = 'http://localhost:3000/repositories';
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    spawn(start, [url], { stdio: 'ignore', detached: true }).unref();
  });

repoCommand
  .command('fork <repo>')
  .description('Fork a repository')
  .action((repo) => {
    console.log(`🍴 Forking repository: ${repo}`);
    
    const url = `http://localhost:3000/fork/${encodeURIComponent(repo)}`;
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    spawn(start, [url], { stdio: 'ignore', detached: true }).unref();
  });

repoCommand
  .command('delete <repo>')
  .description('Delete a repository')
  .action((repo) => {
    console.log(`🗑️  Deleting repository: ${repo}`);
    console.log('⚠️  Wallet confirmation required');
    
    const url = `http://localhost:3000/delete/${encodeURIComponent(repo)}`;
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    spawn(start, [url], { stdio: 'ignore', detached: true }).unref();
  });

// Bounty commands
const bountyCommand = program
  .command('bounty')
  .description('Bounty management commands');

bountyCommand
  .command('create')
  .description('Create a new bounty')
  .option('-t, --title <title>', 'Bounty title')
  .option('-r, --reward <amount>', 'Reward amount in DOT')
  .action((options) => {
    console.log('💰 Creating new bounty...');
    console.log('🤖 AI assistance available for bounty form');
    
    const params = new URLSearchParams();
    if (options.title) params.set('title', options.title);
    if (options.reward) params.set('reward', options.reward);
    
    const url = `http://localhost:3000/bounty/create${params.toString() ? '?' + params.toString() : ''}`;
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    spawn(start, [url], { stdio: 'ignore', detached: true }).unref();
  });

bountyCommand
  .command('apply <bounty-id>')
  .description('Apply for a bounty')
  .action((bountyId) => {
    console.log(`📝 Applying for bounty: ${bountyId}`);
    console.log('🤖 AI assistance available for application');
    
    const url = `http://localhost:3000/bounty/${bountyId}/apply`;
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    spawn(start, [url], { stdio: 'ignore', detached: true }).unref();
  });

// Deploy command
program
  .command('deploy')
  .description('Deploy repository as live site')
  .option('-r, --repo <repo>', 'Repository to deploy')
  .action((options) => {
    console.log('🚀 Deploying site...');
    
    if (!options.repo) {
      console.log('❌ Repository name is required');
      console.log('Usage: polkaforge deploy -r <repo>');
      return;
    }

    console.log(`📦 Deploying repository: ${options.repo}`);
    console.log('🌐 Self-hosted Polkadot deployment available');
    
    const url = `http://localhost:3000/deploy?repo=${encodeURIComponent(options.repo)}`;
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    spawn(start, [url], { stdio: 'ignore', detached: true }).unref();
  });

// AI commands
const aiCommand = program
  .command('ai')
  .description('AI assistance commands');

aiCommand
  .command('fix <file>')
  .description('Get AI suggestions to fix code in file')
  .action((file) => {
    console.log(`🤖 Analyzing file: ${file}`);
    
    if (!fs.existsSync(file)) {
      console.log(`❌ File not found: ${file}`);
      return;
    }

    console.log('🔍 Gemini AI analyzing code...');
    console.log('📱 Opening AI fix suggestions in browser...');
    
    const url = `http://localhost:3000/ai/fix?file=${encodeURIComponent(file)}`;
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    spawn(start, [url], { stdio: 'ignore', detached: true }).unref();
  });

aiCommand
  .command('chat')
  .description('Open AI chat interface')
  .action(() => {
    console.log('💬 Opening AI chat...');
    
    const url = 'http://localhost:3000/ai/chat';
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    spawn(start, [url], { stdio: 'ignore', detached: true }).unref();
  });

// Help command enhancement
program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ polkaforge open                           # Open PolkaForge DApp');
  console.log('  $ polkaforge repo create -n "my-project"    # Create new repository');
  console.log('  $ polkaforge repo list                      # List all repositories');
  console.log('  $ polkaforge bounty create -t "Fix bug"     # Create bounty');
  console.log('  $ polkaforge deploy -r "my-project"         # Deploy repository');
  console.log('  $ polkaforge ai fix ./src/main.rs          # Get AI code fixes');
  console.log('');
  console.log('🌟 PolkaForge - Decentralized GitHub on Polkadot');
  console.log('📖 Documentation: https://docs.polkaforge.dev');
});

program.parse();