# Globs

Nuka-Code uses glob patterns to determine what to nuke. You can find the list of supported globs below.

> [!TIP]
> It is recommended to add a `.nukeignore` file to your project to exclude files and directories from being nuked.

## node_modules

The directory(s) where your project's dependencies are installed.

- `node_modules`
- `**/node_modules`

## build

The directory(s) where your project's build artifacts are stored, such as `dist`, `out`, `build`, `bundle`, etc.

- `dist`
- `**/dist`
- `out`
- `**/out`
- `output`
- `**/output`
- `outputs`
- `**/outputs`
- `bundle`
- `**/bundle`
- `.vercel`
- `**/.vercel`
- `.next`
- `**/.next`
- `.nuxt`
- `**/.nuxt`
- `.svelte-kit`
- `**/.svelte-kit`
- `.vinxi`
- `**/.vinxi`
- `.vuepress/dist`
- `**/.vuepress/dist`
- `storybook-static`
- `**/storybook-static`
- `coverage`
- `**/coverage`
- `public/build`
- `**/public/build`

## cache

The directory(s) where your project's cache is stored, such as `.turbo`, `.vite`, `.next`, etc.

- `.turbo`
- `**/.turbo`
- `.nx/cache`
- `**/.nx/cache`
