import * as zod from "zod";

export const ImageSchema = zod.object({
  id: zod.string(),
  url: zod.string(),
  hash: zod.string().optional(),
});

export type ImageSchemaType = zod.infer<typeof ImageSchema>;
