"use server";

import { addProductInDB } from "@/data-access/product";
import { handleError } from "@/error-handling/wrap-with-try-catch";
import { getSessionByRole } from "@/lib/getSessionSeller";
import { ActionSuccessBase, userRoles } from "@/types/shared";
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

const listAProductSchema = z.object({
  brandId: z.string().min(2).max(100),
  categoryId: z.string().min(2).max(100),
  name: z.string().min(2).max(100),
  description: z.string().min(2).max(100),
  //todo: not able to handle multiple files at once : may need upload things
  pics: z
    .instanceof(File, { message: "Required" })
    .refine((file) => file.size <= 5000000 && file.type.startsWith("image/"), {
      message: "File size should not exceed 5MB",
    }),
  tags: stringToJSONSchema.pipe(z.string().array()),
});


export const listAProduct = handleError(
  async (prevState: unknown, formData: FormData) => {
    const { success, data, error } = listAProductSchema.safeParse(
      Object.fromEntries(formData.entries())
    );
    if (error) {
      return { formErrors: error.formErrors.fieldErrors };
    }

    const session = await getSessionByRole(userRoles.seller);

    let updatedData = {
      ...data,
      sellerId: session.user.id,
      pics: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
      ],
    };

    const id = await addProductInDB(updatedData);

    type Success=ActionSuccessBase & {
    }
    const successObj: Success = {
      message: "Product added successfully",
      redirectPath: `/seller/products/add-variants/${id}`,
    };
    return {
      success: successObj,
    };
  }
);









