import consola from 'consola';
import { rimraf } from 'rimraf';


export async function nukeNodeModules() {
  await rimraf(['**/node_modules', 'node_modules'], { glob: true });
}

export async function nukeBuilds() {
  await rimraf(['**/dist', 'dist'], { glob: true });
}

export async function nukeAll() {
  await nukeBuilds();

  // MUST BE LAST or this breaks it cause we are NUKING node_modules
  await nukeNodeModules();
}

// Internals

const standardOutputDirectories = [
  'dist',
  'build',
  'out',
  'output',
  'bundle'
];

const frameworkOutputDirectories = [
  // Next.js
  '.next',
  '.vercel',
  // Nuxt.js
  '.nuxt',
  '.output',
  // SvelteKit
  '.svelte-kit',
    // TanStack Start
  '.vinxi',
  // VuePress
  '.vuepress/dist',
  // Storybook
  'storybook-static',
  // Jest
  'coverage',
  // Remix
  'public/build'
];