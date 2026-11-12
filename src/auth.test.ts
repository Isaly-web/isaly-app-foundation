import { describe, expect, it } from "vitest";

import {
  AUTH_ERROR_KEYS,
  AUTH_MESSAGES,
  PASSWORD_MIN_LENGTH,
  authErrorKey,
  authErrorMessage,
  isExistingAccountSignup,
  isNewPasswordLongEnough,
} from "./auth.js";

const tFor = (lang: "sv" | "en") => (key: string) =>
  (AUTH_MESSAGES[lang] as Record<string, string>)[key] ??
  (key === "error_generic" ? (lang === "sv" ? "Något gick fel" : "Something went wrong") : key);

describe("password rule", () => {
  it("is 8 characters, the minimum Supabase Auth enforces for the shared project", () => {
    expect(PASSWORD_MIN_LENGTH).toBe(8);
  });

  it("accepts exactly the minimum and rejects one character less", () => {
    expect(isNewPasswordLongEnough("12345678")).toBe(true);
    expect(isNewPasswordLongEnough("1234567")).toBe(false);
    expect(isNewPasswordLongEnough("")).toBe(false);
  });

  it("states the same number in the validation text", () => {
    expect(AUTH_MESSAGES.sv["auth.validation.password_min"]).toBe("Minst 8 tecken");
    expect(AUTH_MESSAGES.en["auth.validation.password_min"]).toBe("At least 8 characters");
  });
});

describe("authErrorKey", () => {
  it.each([
    [{ code: "invalid_credentials", message: "x" }, "auth.error.invalid_credentials"],
    [{ message: "Invalid login credentials" }, "auth.error.invalid_credentials"],
    [{ message: "Email not confirmed" }, "auth.error.email_not_confirmed"],
    [{ message: "User already registered" }, "auth.error.user_exists"],
    [{ code: "weak_password", message: "x" }, "auth.error.weak_password"],
    [{ message: "Password should be at least 8 characters." }, "auth.error.weak_password"],
    [
      { message: "New password should be different from the old password." },
      "auth.error.same_password",
    ],
    [{ code: "over_email_send_rate_limit", message: "x" }, "auth.error.rate_limit"],
    [{ message: "Auth session missing!" }, "auth.error.link_expired"],
  ])("maps %j", (error, key) => {
    expect(authErrorKey(error)).toBe(key);
  });

  it("returns null for unknown or missing errors", () => {
    expect(authErrorKey({ message: "database exploded at 10.0.0.1" })).toBeNull();
    expect(authErrorKey({ code: "toString", message: "x" })).toBeNull();
    expect(authErrorKey(null)).toBeNull();
  });

  it("only returns keys that are listed and have a text in every language", () => {
    for (const lang of ["sv", "en"] as const) {
      for (const key of AUTH_ERROR_KEYS) expect(AUTH_MESSAGES[lang][key]).toBeTruthy();
    }
  });
});

describe("authErrorMessage", () => {
  it.each(["sv", "en"] as const)("localizes known errors in %s", (lang) => {
    expect(authErrorMessage({ message: "Invalid login credentials" }, tFor(lang))).toBe(
      AUTH_MESSAGES[lang]["auth.error.invalid_credentials"],
    );
  });

  it("falls back to the generic message and never leaks the raw message", () => {
    const raw = "JWT secret mismatch: sk_live_123";
    expect(authErrorMessage({ message: raw }, tFor("sv"))).toBe("Något gick fel");
    expect(authErrorMessage({ message: raw }, tFor("en"))).toBe("Something went wrong");
  });
});

describe("isExistingAccountSignup", () => {
  it("is true only for a returned user without identities", () => {
    expect(isExistingAccountSignup({ identities: [] })).toBe(true);
    expect(isExistingAccountSignup({ identities: [{}] })).toBe(false);
    expect(isExistingAccountSignup({})).toBe(false);
    expect(isExistingAccountSignup({ identities: null })).toBe(false);
    expect(isExistingAccountSignup(null)).toBe(false);
  });
});
