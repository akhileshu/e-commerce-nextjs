"use server";

import { z } from "zod";
import { addCategoryChildrenInDb } from "../_db-operations/db-operations";

const stringToJSONSchema = z
  .string()
  .transform((str, ctx) /* : z.infer<ReturnType<typeof json>> */ => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON" });
      return z.NEVER;
    }
  });

const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  metadata: z.string().nullable(),
  description: z.string().min(2).max(100),
  tags: z.string().array().optional(),
});

const addChildrenCategorySchema = z.object({
  categories: stringToJSONSchema.pipe(categorySchema.array()),
  parentCategoryId: z.string(),
});

export async function addCategoryChildren(
  prevState: unknown,
  formData: FormData
) {
  try {
    const { success, data, error } = addChildrenCategorySchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (error) {
      return error.formErrors.fieldErrors;
    }
    console.log(data);
    const rootCategory = addCategoryChildrenInDb(data);
    // todo: close popup
  } catch (error) {
    throw error; // Re-throw for proper error handling
  }
}
