import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import * as fs from 'node:fs';
import { rollup } from 'rollup';
import type { PackageJson } from 'type-fest';

/**
	Bundles all dependencies with Rollup to produce a CommonJS bundle
*/
export async function createCommonjsBundle(pkg: PackageJson) {
	if (pkg.exports === undefined || pkg.exports === null) {
		return pkg;
	}

	if (typeof pkg.exports !== 'string') {
		throw new TypeError(
			'Using an object with `exports` is not supported (yet)'
		);
	}

	const bundle = await rollup({
		plugins: [json(), nodeResolve(), commonjs()],
		input: pkg.exports,
	});

	if (!fs.existsSync('dist')) {
		fs.mkdirSync('dist');
	}

	await bundle.write({
		file: 'dist/index.cjs',
		format: 'commonjs',
	});

	pkg.exports = {
		import: pkg.exports,
		require: './index.cjs',
	};
}