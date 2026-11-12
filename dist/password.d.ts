/** Minimum length of a NEW password (sign-up, password reset, password change). */
export declare const PASSWORD_MIN_LENGTH = 8;
/**
 * True when `password` is long enough to be chosen as a new password.
 *
 * Use it only where a password is chosen. Never use it on a sign-in form: accounts created before
 * the minimum was raised may have a shorter password, and they must still be able to sign in.
 */
export declare function isNewPasswordLongEnough(password: string): boolean;
