// Swedish and English texts for the shared auth keys, for apps that do not keep them in their own
// dictionaries. Apps with their own dictionaries may copy them; the keys are what must stay equal.
import { PASSWORD_MIN_LENGTH } from "./password.js";
export const AUTH_MESSAGES = {
    sv: {
        "auth.error.invalid_credentials": "Fel e-post eller lösenord.",
        "auth.error.email_not_confirmed": "Bekräfta din e-postadress med länken vi skickade innan du loggar in.",
        "auth.error.user_exists": "Det finns redan ett konto med den e-postadressen. Prova att logga in.",
        "auth.error.weak_password": "Lösenordet är för svagt. Välj ett längre eller mer unikt lösenord.",
        "auth.error.same_password": "Det nya lösenordet måste skilja sig från det nuvarande.",
        "auth.error.rate_limit": "För många försök. Vänta en stund och försök igen.",
        "auth.error.link_expired": "Återställningslänken är ogiltig eller har gått ut. Begär en ny.",
        "auth.validation.password_min": `Minst ${PASSWORD_MIN_LENGTH} tecken`,
        "auth.signup.existing": "Du har redan ett Isaly-konto med den e-postadressen. Logga in med ditt vanliga lösenord, eller välj Glömt lösenord.",
    },
    en: {
        "auth.error.invalid_credentials": "Wrong email or password.",
        "auth.error.email_not_confirmed": "Please confirm your email address using the link we sent before logging in.",
        "auth.error.user_exists": "An account with this email already exists. Try logging in.",
        "auth.error.weak_password": "The password is too weak. Choose a longer or more unique password.",
        "auth.error.same_password": "The new password must be different from the current one.",
        "auth.error.rate_limit": "Too many attempts. Wait a moment and try again.",
        "auth.error.link_expired": "The reset link is invalid or has expired. Request a new one.",
        "auth.validation.password_min": `At least ${PASSWORD_MIN_LENGTH} characters`,
        "auth.signup.existing": "You already have an Isaly account with that e-mail address. Sign in with your usual password, or choose Forgot password.",
    },
};
