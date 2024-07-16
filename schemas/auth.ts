import zod from "zod";

export const email = zod
  .string()
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid format for email address" })
  .trim();
export const phone_number = zod
  .string({ required_error: "Phone number is required" })
  .min(10, { message: "Phone number must contain at least 10 digits" })
  .max(11, {
    message: "Phone number should not exceed to more than 11 digits",
  })
  .trim();

export const password = zod
  .string()
  .min(8, { message: "Password must contain at least 8 characters" });

export const useCredentialSchema = (using: "email" | "phone_number") => {
  if (!["email", "phone_number"].includes(using)) {
    throw new Error(`Invalid argument '${using}'.`);
  }

  return zod.object({
    [using === "email" ? "email" : "phone_number"]:
      using === "email" ? email : phone_number,
    password,
  });
};
export const UserCredentialSchema = zod
  .object({
    email: email,
    phone_number: zod
      .string({ required_error: "Phone number is required" })
      .min(10, { message: "Phone number must contain at least 10 digits" })
      .max(11, {
        message: "Phone number should not exceed to more than 11 digits",
      })
      .trim(),
    password: zod
      .string()
      .min(8, { message: "Password must contain at least 8 characters" }),
  })
  .refine(
    (credentials) => {
      if (credentials.email === "" && credentials.phone_number === "") {
        return false;
      }
      return true;
    },
    { path: ["non_field"], message: "Email or Phone Number is required" }
  );

export type UserCredentials = zod.infer<typeof UserCredentialSchema>;
