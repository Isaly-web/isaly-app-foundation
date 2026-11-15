# isaly-app-foundation

Code shared by every Isaly app (`@isaly-web/app-foundation`). It holds the parts of the
"Isaly App Foundation" rules that must behave the same in every app, so they are written and tested
once instead of copied per app.

## What is in it

| Import                           | Contents                                                                                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@isaly-web/app-foundation/auth` | `PASSWORD_MIN_LENGTH` (8), `isNewPasswordLongEnough`, `authErrorKey`, `authErrorMessage`, `isExistingAccountSignup`, `AUTH_ERROR_KEYS`, `AUTH_MESSAGES` (Swedish/English) |

Everything is pure and isomorphic: no Supabase import, no React, no environment variables, no
secrets. It runs in the browser and on the server.

Not in it (yet): pages and components (`/auth`, `/reset-password`), because the apps use different
route names and i18n solutions; `webhook-auth.server.ts` and `email-unsubscribe.ts`, which are the
next candidates.

## The password rule

`PASSWORD_MIN_LENGTH` must equal the minimum password length set in Supabase Auth for the shared
project `isaly-apps-prod` (set to 8 on 2026-11-12). Supabase enforces it for every app; the constant
only lets forms say so before the request is sent. Change both together, never one of them.

Apply the rule where a password is **chosen** (sign-up, reset, change). Do not put it on a sign-in
field: older accounts may have a shorter password and must still be able to sign in.

## Using it in an app

The package is published to GitHub Packages (the npm registry at `npm.pkg.github.com`) from this
private repository, so it is private too: installing it always needs a token.

1. Add an `.npmrc` to the app repository (commit it; it holds no secret, only the name of an
   environment variable):

   ```ini
   @isaly-web:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
   ```

   npm and bun both read this file. Only `@isaly-web/*` packages go to GitHub; everything else still
   comes from the public npm registry. Once the file exists, `npm install` fails on any machine where
   `GITHUB_PACKAGES_TOKEN` is not set, so add the file together with the token everywhere below.

2. Add the dependency with an exact version, and update every lockfile the app has:

   ```json
   "dependencies": {
     "@isaly-web/app-foundation": "0.1.0"
   }
   ```

3. Give every place that installs the app's dependencies a token in `GITHUB_PACKAGES_TOKEN`:
   - **The app's GitHub Actions:** in this package's settings on GitHub (organization → Packages →
     `app-foundation` → Package settings → Manage Actions access), add the app's repository with the
     Read role. Then the workflow's own token works; give the job `permissions: packages: read`
     (plus whatever it already has) and set
     `GITHUB_PACKAGES_TOKEN: ${{ secrets.GITHUB_TOKEN }}` on the install step.
   - **The app's Vercel project:** an environment variable `GITHUB_PACKAGES_TOKEN` (Production and
     Preview) holding a personal access token with only the `read:packages` scope. GitHub's
     documentation for the npm registry asks for a classic token; give it an expiry date and renew
     it before it runs out, or every Vercel build fails at install.
   - **A developer's machine:** the same kind of token, exported in the shell.

```ts
import { authErrorMessage, isNewPasswordLongEnough } from "@isaly-web/app-foundation/auth";
```

## Development

```bash
bun install
```

```bash
bun run test
```

```bash
bun run typecheck
```

```bash
bun run build:dist
```

`bun run build:dist` rewrites `dist/`. Commit `dist/` together with the source change; CI fails when
they differ.

## Releasing

1. Raise `version` in `package.json` (a breaking change raises the first number) and merge to
   `main`.
2. On GitHub: Releases → Draft a new release → new tag `v<version>` with target `main` → Publish.
   Mark it as a pre-release to publish under the dist-tag `next` instead of `latest`.
3. The workflow `.github/workflows/publish.yml` checks that the tag equals the version, runs the
   checks and publishes. A version can be published only once; to fix a release, publish a new
   version.
4. In each app, raise the version in `package.json` and update its lockfile(s).
