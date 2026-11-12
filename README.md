# isaly-app-foundation

Code shared by every Isaly app (`@isaly/app-foundation`). It holds the parts of the
"Isaly App Foundation" rules that must behave the same in every app, so they are written and tested
once instead of copied per app.

## What is in it

| Import                       | Contents                                                                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@isaly/app-foundation/auth` | `PASSWORD_MIN_LENGTH` (8), `isNewPasswordLongEnough`, `authErrorKey`, `authErrorMessage`, `isExistingAccountSignup`, `AUTH_ERROR_KEYS`, `AUTH_MESSAGES` (Swedish/English) |

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

The repository is private and the package is not published to a registry. An app installs it from
git, pinned to a release tag:

```json
"dependencies": {
  "@isaly/app-foundation": "github:Isaly-web/isaly-app-foundation#v0.1.0"
}
```

The built files in `dist/` are committed, so the app needs no build step for the package.

Because the repository is private, every place that installs the app's dependencies needs read
access to it: the developer's machine, the app's GitHub Actions workflow and the app's Vercel
project. This is not set up yet for any app; decide on the mechanism (for example a fine-grained
token with read-only access to this repository only) before the first app depends on the package.

```ts
import { authErrorMessage, isNewPasswordLongEnough } from "@isaly/app-foundation/auth";
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
bun run build
```

`bun run build` rewrites `dist/`. Commit `dist/` together with the source change; CI fails when
they differ.

## Releasing

1. Raise `version` in `package.json` (a breaking change raises the first number).
2. Merge to `main`.
3. Tag the merge commit `v<version>` and push the tag.
4. In each app, change the tag in `package.json` and update its lockfile(s).
