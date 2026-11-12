// Maps known Supabase auth errors to i18n keys so the UI never shows raw,
// English provider messages. Pure and isomorphic (no Supabase import): it only
// inspects the `code` / `message` of an error object and never changes it.

export type AuthErrorLike = { message?: string; code?: string } | null | undefined;

/** Every key `authErrorKey` can return. Each app's dictionaries must contain all of them. */
export const AUTH_ERROR_KEYS = [
  "auth.error.invalid_credentials",
  "auth.error.email_not_confirmed",
  "auth.error.user_exists",
  "auth.error.weak_password",
  "auth.error.same_password",
  "auth.error.rate_limit",
  "auth.error.link_expired",
] as const;

export type AuthErrorKey = (typeof AUTH_ERROR_KEYS)[number];

const KEY_BY_CODE: Record<string, AuthErrorKey> = {
  invalid_credentials: "auth.error.invalid_credentials",
  email_not_confirmed: "auth.error.email_not_confirmed",
  user_already_exists: "auth.error.user_exists",
  email_exists: "auth.error.user_exists",
  weak_password: "auth.error.weak_password",
  same_password: "auth.error.same_password",
  over_request_rate_limit: "auth.error.rate_limit",
  over_email_send_rate_limit: "auth.error.rate_limit",
  otp_expired: "auth.error.link_expired",
  session_not_found: "auth.error.link_expired",
};

// Older GoTrue versions only expose the English message, so match those too.
const KEY_BY_MESSAGE: Array<[RegExp, AuthErrorKey]> = [
  [/invalid login credentials/i, "auth.error.invalid_credentials"],
  [/email not confirmed/i, "auth.error.email_not_confirmed"],
  [/user already registered/i, "auth.error.user_exists"],
  [/password should be at least|password is too weak|weak password/i, "auth.error.weak_password"],
  [/different from the old password/i, "auth.error.same_password"],
  [/rate limit|too many requests|security purposes/i, "auth.error.rate_limit"],
  [
    /auth session missing|link is invalid or has expired|token has expired or is invalid/i,
    "auth.error.link_expired",
  ],
];

/** i18n key for a recognised auth error, or null when the error is unknown. */
export function authErrorKey(error: AuthErrorLike): AuthErrorKey | null {
  if (!error) return null;
  // Own keys only: a code such as "toString" must not match an inherited object property.
  const byCode =
    error.code && Object.hasOwn(KEY_BY_CODE, error.code) ? KEY_BY_CODE[error.code] : undefined;
  if (byCode) return byCode;
  const message = error.message ?? "";
  for (const [pattern, key] of KEY_BY_MESSAGE) if (pattern.test(message)) return key;
  return null;
}

/** User-facing text for an auth error: known errors are translated, anything else
 *  gets the generic localized message — the raw provider message is never returned. */
export function authErrorMessage(error: AuthErrorLike, t: (key: string) => string): string {
  return t(authErrorKey(error) ?? "error_generic");
}

/**
 * Supabase does not fail a sign-up for an address that already has an account (that would reveal
 * which addresses are registered). It answers with success, sends no e-mail and returns a user
 * whose `identities` list is empty. With one shared account for every Isaly app this is the normal
 * case for people who use another Isaly app, so the sign-up form sends them to sign-in instead.
 */
export function isExistingAccountSignup(
  user: { identities?: unknown[] | null } | null | undefined,
): boolean {
  return !!user && Array.isArray(user.identities) && user.identities.length === 0;
}
