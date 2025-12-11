#!/usr/bin/env node
import { Command } from 'commander';
import { LanguageDetector } from '../languageDetector.js';
import { I18n } from '../i18n/index.js';
import { DetectCommand } from './commands/detect.js';
import { SetCommand } from './commands/set.js';
import { ShowCommand } from './commands/show.js';
import { ListCommand } from './commands/list.js';

async function main() {
  // Initialize detector and detect language
  const detector = new LanguageDetector();
  const languageResult = await detector.detect();

  // Initialize i18n with detected language and confidence
  const i18n = new I18n(languageResult.language, languageResult.confidence);

  const program = new Command();

  program
    .name('pnl')
    .description('Preferred Natural Language - CLI tool for language preference detection')
    .version('3.0.0');

  // detect command
  program
    .command('detect')
    .description('Detect your preferred natural language')
    .action(async () => {
      try {
        const command = new DetectCommand(detector, i18n);
        const result = await command.execute();
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : i18n.t('error.unknown'));
        process.exit(1);
      }
    });

  // set command
  program
    .command('set <language>')
    .description('Set your preferred language (e.g., pnl set zh-CN)')
    .action(async (language: string) => {
      try {
        const command = new SetCommand(detector, i18n);
        const result = await command.execute(language);
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : i18n.t('error.unknown'));
        process.exit(1);
      }
    });

  // show command
  program
    .command('show')
    .description('Show detailed language preference information')
    .action(async () => {
      try {
        const command = new ShowCommand(detector, i18n);
        const result = await command.execute();
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : i18n.t('error.unknown'));
        process.exit(1);
      }
    });

  // list command
  program
    .command('list')
    .description('List all supported languages')
    .action(async () => {
      try {
        const command = new ListCommand(i18n);
        const result = await command.execute();
        console.log(result);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : i18n.t('error.unknown'));
        process.exit(1);
      }
    });

  // mcp command
  program
    .command('mcp')
    .description('Start MCP server')
    .action(async () => {
      try {
        // Dynamically import and run MCP server
        await import('../mcp/server.js');
      } catch (error) {
        console.error('Error starting MCP server:', error instanceof Error ? error.message : i18n.t('error.unknown'));
        process.exit(1);
      }
    });

  // Parse command line arguments
  program.parse();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
