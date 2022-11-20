import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import bundleSize from 'rollup-plugin-bundle-size';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

export default {
  input: './src/browser.ts',
  output: {
    sourcemap: false,
    file: './lib/browser.min.js',
    format: 'iife',
  },
  plugins: [
    typescript(),
    babel(),
    json(),
    nodeResolve({ mainFields: ['module', 'jsnext'] }),
    commonjs({ include: 'node_modules/**' }),
    bundleSize(),
    uglify(),
  ],
};
