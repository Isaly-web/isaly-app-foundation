// The password rule of the shared Isaly account. Supabase Auth enforces the same minimum for the
// whole project (Authentication settings in `isaly-apps-prod`), so this constant must match that
// setting: a form that allows less lets the user submit a password the server then rejects.
/** Minimum length of a NEW password (sign-up, password reset, password change). */
export const PASSWORD_MIN_LENGTH = 8;
/**
 * True when `password` is long enough to be chosen as a new password.
 *
 * Use it only where a password is chosen. Never use it on a sign-in form: accounts created before
 * the minimum was raised may have a shorter password, and they must still be able to sign in.
 */
export function isNewPasswordLongEnough(password) {
    return password.length >= PASSWORD_MIN_LENGTH;
}
