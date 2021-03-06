import { Options } from 'yargs';
import { red, green } from '@friends-library/cli-utils/color';
import chalk from 'chalk';
import { Argv } from '../type';
import { getRepos, getStatusGroups } from '../repos';
import { excludable, scopeable, relPath } from './helpers';

export async function handler({ exclude, scope }: Argv): Promise<void> {
  const repos = await getRepos(exclude, scope);
  const { dirty } = await getStatusGroups(repos);
  if (dirty.length === 0) {
    green(`🛁  No uncommitted changes in any document repos.`);
    return;
  }

  red(`🚽  Uncommitted changes found in ${dirty.length} repos:`);
  dirty.forEach((repo) => {
    console.log(`   ${chalk.grey(`↳`)} ${chalk.yellow(relPath(repo))}`);
  });
}

export const command = `status`;

export const describe = `Reports the current status for all repos`;

export const builder: { [key: string]: Options } = {
  ...excludable,
  ...scopeable,
};
