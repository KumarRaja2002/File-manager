import { email, nonEmpty, object, pipe, string } from "valibot";
import { EMAIL_INVALID, EMAIL_REQUIRED, EMAIL_STRING, PASSWORD_REQUIRED, PASSWORD_STRING } from "../../constants/appMessages";


export const SignInSchema = object({
    email: pipe(
        string(EMAIL_STRING),
        nonEmpty(EMAIL_REQUIRED),
        email(EMAIL_INVALID)
    ),

    password: pipe(
        string(PASSWORD_STRING),
        nonEmpty(PASSWORD_REQUIRED)
    ),
  });