export type AuthErrorLike = {
    message?: string;
    code?: string;
} | null | undefined;
/** Every key `authErrorKey` can return. Each app's dictionaries must contain all of them. */
export declare const AUTH_ERROR_KEYS: readonly ["auth.error.invalid_credentials", "auth.error.email_not_confirmed", "auth.error.user_exists", "auth.error.weak_password", "auth.error.same_password", "auth.error.rate_limit", "auth.error.link_expired"];
export type AuthErrorKey = (typeof AUTH_ERROR_KEYS)[number];
/** i18n key for a recognised auth error, or null when the error is unknown. */
export declare function authErrorKey(error: AuthErrorLike): AuthErrorKey | null;
/** User-facing text for an auth error: known errors are translated, anything else
 *  gets the generic localized message — the raw provider message is never returned. */
export declare function authErrorMessage(error: AuthErrorLike, t: (key: string) => string): string;
/**
 * Supabase does not fail a sign-up for an address that already has an account (that would reveal
 * which addresses are registered). It answers with success, sends no e-mail and returns a user
 * whose `identities` list is empty. With one shared account for every Isaly app this is the normal
 * case for people who use another Isaly app, so the sign-up form sends them to sign-in instead.
 */
export declare function isExistingAccountSignup(user: {
    identities?: unknown[] | null;
} | null | undefined): boolean;
