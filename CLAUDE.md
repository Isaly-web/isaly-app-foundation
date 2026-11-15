# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`@isaly-web/app-foundation`: code shared by every Isaly app (Auto Job Radar, Isaly Books, Snap & Savor
and the others in the `Isaly-web` organization). See `README.md` for the contents, how apps install
it and how a release is made.

## Commands

```bash
bun install        # bun.lock is the only lockfile; bunfig.toml has a 24h supply-chain guard
bun run test       # vitest run
bun run typecheck  # tsc --noEmit
bun run build:dist # rewrites dist/ (committed)
bun run format     # prettier --write .
```

CI (`.github/workflows/ci.yml`, on pull requests): prettier, typecheck, tests, build, and a check
that the committed `dist/` equals the build output. All blocking.

Publishing (`.github/workflows/publish.yml`): a published GitHub Release with the tag `v<version>`
runs the same checks and publishes the package to GitHub Packages (`npm.pkg.github.com`) with the
workflow's own token. Apps install it from there through an `.npmrc` (see `README.md`). The package
name must keep the scope `@isaly-web`, the owner of this repository, or GitHub refuses it.

## Rules

- Only code that at least two apps use in the same way belongs here. App-specific product logic
  stays in the app.
- Keep modules pure and isomorphic unless the file name ends in `.server.ts`. No secrets, internal
  hostnames, keys or environment-specific values: every app, and everyone with access to any app's
  `node_modules`, can read this package.
- No runtime dependencies without the project owner's approval; the package must stay cheap to
  install in every app.
- Relative imports end in `.js` (NodeNext). Every public symbol is exported from an entry file
  listed under `exports` in `package.json`.
- User-facing texts exist in Swedish and English and never contain a raw provider message.
- `PASSWORD_MIN_LENGTH` mirrors a setting in Supabase Auth for the shared project. Do not change it
  unless the project owner has changed that setting.
- No script named `build`, `prepare`, `prepack`, `preinstall`, `install` or `postinstall`: npm
  runs them when the package is installed from git or published, and a git install failed because
  of it (`package.test.ts` checks it). The build script is `build:dist`; `dist/` is committed.
- A change in behaviour needs a test, a rebuilt `dist/` and a new version; apps pick it up only
  when they move to the new version.
