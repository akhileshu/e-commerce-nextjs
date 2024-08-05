"use server";

import { getCategoryAttributesByProductId } from "@/data-access/categoryAttribute";
import { getProductByIdToAddVariants } from "@/data-access/product";
import { addProductVarientInDB } from "@/data-access/productVariant";
import {
  handleError
} from "@/error-handling/wrap-with-try-catch";
import { uploadImageAndGetUrl } from "@/lib/uploadFiles";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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

const stringToNumberSchema = z
  .string()
  .transform((str, ctx) /* : z.infer<ReturnType<typeof json>> */ => {
    try {
      return parseFloat(str);
    } catch (e) {
      ctx.addIssue({ code: "custom", message: "Invalid String" });
      return z.NEVER;
    }
  });

const addProductVarientSchema = z.object({
  price: stringToNumberSchema.pipe(z.number().min(1).max(10000)),
  productId: z.string().min(2).max(100),
  description: z.string().min(2).max(100),
  productVariantToAttributes: stringToJSONSchema.pipe(
    z
      .object({
        categoryAttributeId: z.string().min(2).max(100),
        value: z.string().min(1).max(100),
      })
      .array()
  ),
  //todo: not able to handle multiple files at once : may need upload things
  pics: z
    .instanceof(File, { message: "Required" })
    .refine((file) => file.size <= 5000000 && file.type.startsWith("image/"), {
      message: "File size should not exceed 5MB",
    }),
  tags: stringToJSONSchema.pipe(z.string().array()),
});

export const getCachedProduct = unstable_cache(
  handleError(async (productId) => {
    return await getProductByIdToAddVariants(productId);
  }),
  ["product"],
  { tags: ["get-product-for-adding-variant"] }
);

export const getCategoryAttributes = handleError(async (productId: string) => {
  return await getCategoryAttributesByProductId(productId);
});

export async function addProductVarient(
  prevState: unknown,
  formData: FormData
) {
  const { success, data, error } = addProductVarientSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (error) {
    return { error: error.formErrors.fieldErrors };
  }

  let imagePath = await uploadImageAndGetUrl(data.pics);
  let updatedData = {
    ...data,
    pics: [imagePath],
  };
  const productVariant = await addProductVarientInDB(updatedData);
  redirect(`/seller/products/add-variants/${data.productId}`);
}
