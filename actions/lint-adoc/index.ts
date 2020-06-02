import fs from 'fs';
import { lint } from '@friends-library/adoc-lint';
import * as core from '@actions/core';
import { Octokit } from '@octokit/action';
import { newOrModifiedFiles } from '../helpers';
import { Annotation, toAnnotation, lintOptions } from './lint-helpers';
import * as pullRequest from './pull-requests';

async function main() {
  const pull_number = pullRequest.number();
  if (!pull_number) {
    return;
  }

  const commitSha = pullRequest.latestCommitSha();
  if (!commitSha) {
    return;
  }

  let annotations: Annotation[] = [];
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
  const client = new Octokit();

  newOrModifiedFiles().forEach(path => {
    const asciidoc = fs.readFileSync(path).toString();
    annotations = [
      ...annotations,
      ...lint(asciidoc, lintOptions(path)).map(l => toAnnotation(l, path)),
    ];
  });

  if (!annotations.length) {
    return;
  }

  core.setFailed(
    `**Found ${annotations.length} lint error${annotations.length > 1 ? 's' : ''}**!`,
  );

  client.checks.create({
    owner,
    repo,
    name: 'lint-adoc',
    head_sha: commitSha,
    status: 'completed',
    conclusion: 'failure',
    output: {
      title: 'Asciidoc lint failure',
      summary: `Found ${annotations.length} problems`,
      annotations,
    },
  });

  client.issues.createComment({
    owner,
    repo,
    issue_number: pull_number,
    body: `Found ${annotations.length} lint violations! :grimacing:\n\nCheck the [changed files](https://github.com/${owner}/${repo}/pull/${pull_number}/files) for comments showing exact violation details.`,
  });
}

main();
