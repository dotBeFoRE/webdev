/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="vitest" />
import { loadEnv } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
import 'dotenv';

export default defineConfig({
  test: {
    environment: 'node',
    env: Object.assign(process.env, loadEnv('test', './', '')),
    globals: true,
    exclude: [...configDefaults.exclude, '**/e2e/**'],
  },
});
