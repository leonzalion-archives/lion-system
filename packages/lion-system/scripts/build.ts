import { execaCommandSync as exec } from 'execa';

import { chProjectDir, copyPackageFiles, rmDist } from '../src/index.js';

chProjectDir(import.meta.url);
rmDist();
exec('tsc');
exec('tsc-alias');
await copyPackageFiles({ commonjs: { external: /\/typescript\// } });
