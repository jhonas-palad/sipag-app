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

// export const password = zod
//   .string()
//   .min(8, { message: "Password must contain at least 8 characters" });

export const SignupSchema = zod.object({
  first_name: zod.string().min(1, { message: "First name is required" }),
  last_name: zod.string().min(1, { message: "Last name is required" }),
  email: zod
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid format for email address" })
    .trim(),
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
  photo: zod
    .object({
      url: zod.string(),
      mimeType: zod.string(),
      fileName: zod.string(),
    })
    .nullable(),
});

const SignupSchemaOptional = SignupSchema.partial({
  email: true,
  last_name: true,
  first_name: true,
  password: true,
  phone_number: true,
  photo: true,
});
export type SignupSchemaAllOptionalType = zod.infer<
  typeof SignupSchemaOptional
>;
export type SignupFormSchemaType = zod.infer<typeof SignupSchema>;

export const SiginFormSchema = zod.object({
  email: zod.string().trim().optional(),
  phone_number: zod.string().trim().optional(),
  password: zod.string().min(1, { message: "Please enter your password" }),
});

export type SiginFormSchemaType = zod.infer<typeof SiginFormSchema>;
