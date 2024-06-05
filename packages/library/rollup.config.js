import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';

export default {
  input: "src/index.ts",
  output: [
    {
      file: 'dist/index.cjs.js',
      format: "cjs",
    },
    {
      file: 'dist/index.esm.js',
      format: "esm",
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json(),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'README.md', dest: 'dist', failOnNonExistence: false },
        { src: 'addon.node', dest: 'dist' }
      ]
    })
  ],
  external: ['fs', 'path']
};