import * as zod from "zod";

export const WasteReportSchema = zod
  .object({
    title: zod.string().min(1, { message: "Please provide a title" }),
    description: zod
      .string()
      .min(1, { message: "Please provide a description" }),
    image: zod
      .object({
        url: zod.string(),
        mimeType: zod.string(),
        fileName: zod.string(),
      })
      .refine(
        ({ url, mimeType, fileName }) => {
          return !!url && !!mimeType && !!fileName;
        },
        { message: "Please upload an image" }
      ),
    location: zod.object({
      latitude: zod.number().nullable(),
      longitude: zod.number().nullable(),
    }),
  })
  .refine(
    ({ location: { latitude, longitude } }) => {
      return latitude !== null && longitude !== null;
    },
    { message: "Please choose a location", path: ["location"] }
  );

export type WasteReportSchemaT = zod.infer<typeof WasteReportSchema>;
