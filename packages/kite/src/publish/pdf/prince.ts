import fs from 'fs-extra';
import { spawn } from 'child_process';
import { yellow } from '@friends-library/cli/color';
import { DocumentArtifacts } from '@friends-library/types';
import { FileManifest } from '@friends-library/types';
import { PUBLISH_DIR } from '../file';

const {
  env: { KITE_PRINCE_BIN },
} = process;

interface Options {
  formatOutput?: (line: string) => string;
}

export function prince(
  manifest: FileManifest,
  srcDir: string,
  filename: string,
  opts: Options = {},
): Promise<DocumentArtifacts> {
  if (srcDir.indexOf(`${PUBLISH_DIR}/_src_/`) === 0) {
    throw new Error(`srcDir param must be relative to ${PUBLISH_DIR}/_src_/`);
  }
  const dir = `${PUBLISH_DIR}/_src_/${srcDir}`;
  const writeFiles = Promise.all(
    Object.keys(manifest).map(path =>
      fs.outputFile(
        `${dir}/${path}`,
        manifest[path],
        path.endsWith('.png') ? 'binary' : undefined,
      ),
    ),
  );

  return writeFiles
    .then(() => {
      const src = `${dir}/doc.html`;
      const stream = spawn(KITE_PRINCE_BIN || '/usr/local/bin/prince-books', [src]);
      let output = '';

      return new Promise((resolve, reject) => {
        stream.stderr.on('data', data => {
          output = output.concat(data.toString());
        });

        stream.on('close', code => {
          output = output
            .trim()
            .split('\n')
            .filter(filterPrinceOutput)
            .map(opts.formatOutput || (l => l))
            .join('\n');

          if (output) {
            yellow(output);
          }

          return code === 0 ? resolve() : reject(new Error(`prince-books error ${code}`));
        });
      });
    })
    .then(() => {
      return fs.move(`${dir}/doc.pdf`, `${PUBLISH_DIR}/${filename}`);
    })
    .then(() => {
      return {
        filePath: `${PUBLISH_DIR}/${filename}`,
        srcDir: dir,
      };
    });
}

function filterPrinceOutput(line: string): boolean {
  if (line.trim() === '') {
    return false;
  }

  if (line.match(/^prince: warning: cannot fit footnote\(s\) on page/)) {
    return false;
  }

  return true;
}