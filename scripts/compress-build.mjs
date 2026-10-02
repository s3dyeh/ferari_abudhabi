import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { constants, gzip, brotliCompress } from 'node:zlib';

const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotliCompress);
async function compress(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await compress(path);
    else if (entry.isFile() && /\.(js|css|html|svg|glb)$/.test(entry.name)) {
      const input = await readFile(path);
      await Promise.all([
        gzipAsync(input).then((output) => writeFile(`${path}.gz`, output)),
        brotliAsync(input, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }).then((output) =>
          writeFile(`${path}.br`, output),
        ),
      ]);
    }
  }
}
await compress(resolve('dist/Animator/browser'));
console.log('Precompressed production assets: gzip + Brotli.');
