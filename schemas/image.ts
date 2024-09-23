import * as zod from "zod";

export const ImageSchema = zod.object({
  id: zod.string(),
  img_file: zod.string(),
  hash: zod.string().optional(),
});

export type ImageSchemaType = zod.infer<typeof ImageSchema>;
