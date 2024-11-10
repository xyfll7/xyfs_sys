

import rollupJson from '@rollup/plugin-json';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { createRequire } from 'node:module';
// import typescript2 from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';

// Import the package.json file to get the version number by using the createRequire function
const requires = createRequire(import.meta.url);
const { module, main } = requires('./package.json');

export default {
  input: "./src/index.ts",
  output: [
    {
      file: `./${module}`,
      format: 'es',
      sourcemap: true
    },
  ],
  external: [],
  plugins: [
    typescript(),
    rollupJson(),
    pluginNodeResolve(),
    commonjs()]
};