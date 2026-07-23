import inquirer from 'inquirer';
import { program } from 'commander';

function getOptions(): { force?: boolean } {
  return program
    .usage('[options] <file>')
    .option('-f, --force', 'Run without prompt (for CI/CD environment)', false)
    .parse(process.argv)
    .opts();
}

export default async function prompt({
  message,
  condition,
  onCancel,
  onAccept,
}: {
  message: string;
  condition: boolean;
  onCancel: () => void;
  onAccept: () => void;
}) {
  const options = getOptions();

  if (!options.force && condition) {
    // Show the interactive cli
    const force = (
      await inquirer.prompt([
        {
          type: 'confirm',
          name: 'force',
          default: options.force,
          message,
        },
      ])
    )?.force;

    if (!force) {
      onCancel();
      return;
    }
  }

  onAccept();
}
