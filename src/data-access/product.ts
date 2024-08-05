"use server";
import db from "@/db/db";
import {
  NotFoundError,
  UnauthenticatedError,
} from "@/error-handling/custom-error-classes";
import { wrapWithDbTryCatch } from "@/error-handling/wrap-with-try-catch";

export const getAllSellerProductsFromDB = wrapWithDbTryCatch(
  async (sellerId: string) => {
    const products = await db.product.findMany({
      where: {
        sellerId,
      },
    });
    return products;
  }
);

export const addProductInDB = wrapWithDbTryCatch(
  async (data: {
    brandId: string;
    categoryId: string;
    name: string;
    description: string;
    pics: string[];
    tags: string[];
    sellerId: string;
  }) => {
    const { brandId, categoryId, name, description, pics, tags, sellerId } =
      data;

    const product = await db.product.create({
      data: {
        name,
        brandId,
        categoryId,
        sellerId,
        pics,
        productSearchability: {
          create: {
            description,
            tags,
          },
        },
      },
    });
    return product.id;
  }
);
export const getProductByIdToAddVariants = wrapWithDbTryCatch(
  async (id: string) => {
    const product = await db.product.findUnique({
      where: { id },
      select: {
        productVariants: {
          include: {
            productVariantToAttributes: true,
          },
        },
        id: true,
        name: true,
        productSearchability: true,
        pics: true,
        categoryId: true,
      },
    });
    if (!product) throw new NotFoundError(`product not found with id ${id}`);
    return product;
  }
);
