import type { AuthErrorKey } from "./auth-errors.js";
export type AuthLanguage = "sv" | "en";
export type AuthMessageKey = AuthErrorKey | "auth.validation.password_min" | "auth.signup.existing";
export declare const AUTH_MESSAGES: Record<AuthLanguage, Record<AuthMessageKey, string>>;
