import chalk from "chalk";

const log = console.log;

export const logger = {
  info: (message: unknown) => log(chalk.blue(message)),
  warn: (message: unknown) => log(chalk.yellow(message)),
  error: (message: unknown) => log(chalk.red(message)),
  debug: (message: unknown) => log(chalk.cyan(message)),
  success: (message: unknown) => log(chalk.green(message)),
};
