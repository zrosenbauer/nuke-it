<div align="center">
  <img src="/assets/hero.png" alt="banner for prompt merge" width="100%" />
</div>

# nuka-code

A package brought to you by Nuka-Cola to zap away those pesky cache, node_modules, and other related files & directories.

![NPM Version](https://img.shields.io/npm/v/nuka-code)
[![Code Standards & Testing](https://github.com/zrosenbauer/nuka-code/actions/workflows/ci.yaml/badge.svg)](https://github.com/zrosenbauer/nuka-code/actions/workflows/ci.yaml)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

## Usage

```bash
npx nuka-code --help
```

OR

```bash
npm install -g nuka-code
nuka-code --help
```

## Nuking Code

This package will nuke the following:

- cache (`.turbo`, `.vite`, `.next`, etc.)
- node_modules
- build artifacts (`dist`, `out`, `build`, `bundle`, etc.)

## Oops I nuked the wrong thing...

Well luckily, Nuka-Code provides a `.nuke/backups-*` directory that will contain a backup of the files that were nuked. Unfortunately, you will need to manually restore the files.

## Acknowledgements

The name, content, art, and other assets are based on the wonderful Fallout universe, and the Nuka-Cola brand. This is fan-art in the form of an npm package and not intended for commercial use or profit, and is not affiliated with Bethesda Softworks or any of its affiliates.

<!-- Sponsorship footer -->
<br>
<br>
<hr>
<div align="center">
  <h2>Sponsorship</h1>
  <div><sup>Special thanks to:</sup></div>
  <br>
  <br>
  <a href="https://www.joggr.io/?utm_source=github&utm_medium=org-readme&utm_campaign=static-docs">
    <img src="https://assets.joggr.io/logos/logo.png" width="160"/>
  </a>
</div>
