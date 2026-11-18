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

## This repository is public

Anyone can read this repository and its whole history. Never commit a secret, key, token, password,
internal hostname or personal data here, not even briefly: a secret that has been pushed is public
from that moment and must be replaced, because deleting the file does not remove it from the
history. Code that needs a secret reads it from an environment variable in the app.

## Using it in an app

An app installs the package straight from this repository, pinned to a release tag. No token and no
registry are needed, because the repository is public:

```json
"dependencies": {
  "@isaly/app-foundation": "github:Isaly-web/isaly-app-foundation#v0.1.0"
}
```

Update every lockfile the app has (`bun install`, and `npm install` too if the app keeps a
`package-lock.json`). The built files in `dist/` are committed, so the app needs no build step for
the package.

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
bun run build:dist
```

`bun run build:dist` rewrites `dist/`. Commit `dist/` together with the source change; CI fails when
they differ.

## Releasing

1. Raise `version` in `package.json` (a breaking change raises the first number) and merge to
   `main`.
2. On GitHub: Releases → Draft a new release → new tag `v<version>` with target `main` → Publish.
   Never move or delete a tag that apps use; to fix a release, make a new version.
3. In each app, change the tag in `package.json` and update its lockfile(s).
