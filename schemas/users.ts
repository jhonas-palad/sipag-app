import * as zod from "zod";
import { ImageSchema } from "./image";

export const UserDetailsSchema = zod.object({
  id: zod.string().nullable(),
  first_name: zod.string().nullable(),
  last_name: zod.string().nullable(),
  email: zod.string().nullable(),
  phone_number: zod.string().nullable(),
  is_verified: zod.boolean().default(false),
  photo: ImageSchema.nullable(),
});

export type UserDetailsType = zod.infer<typeof UserDetailsSchema>;
