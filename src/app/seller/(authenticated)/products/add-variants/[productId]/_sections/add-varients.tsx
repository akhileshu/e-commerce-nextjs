"use client";

import { AttributeCombinationsTable } from "@/app/seller/(authenticated)/products/add-variants/[productId]/_sections/table";
import { BadgeComponent, BadgeComponentWithDelete } from "@/components/badge";
import { getCategoryAttributesByProductId } from "@/data-access/categoryAttribute";
import { cn } from "@/lib/utils";
import { CategoryAttribute } from "@prisma/client";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import {
  AttributeProvider,
  useAttributeContext,
} from "../../../hooks/useAttributeContext";
import { revalidateTag } from "next/cache";
import { getProductByIdToAddVariants } from "@/data-access/product";
import { FormatedError } from "@/error-handling/wrap-with-try-catch";
import { ContainerWithHeading } from "@/app/_components/seller-form";
import Image from "next/image";
import ShowError from "@/app/_components/showError";
import { getCachedProduct, getCategoryAttributes } from "../actions";
import { CollapsibleComponent } from "@/app/_components/collapsible";

interface AddVariantsProps {
  productId: string;
  product: Awaited<ReturnType<typeof getCachedProduct>>;
  categoryAttributes: Awaited<ReturnType<typeof getCategoryAttributes>>;
}

export const AddVariants: React.FC<AddVariantsProps> = ({
  productId,
  product: { data: product, error: productError },
  categoryAttributes: {
    data: categoryAttributes,
    error: categoryAttributesError,
  },
}) => {
  return (
    <ContainerWithHeading heading="Add Product Variants">
      <div>
        <AttributeProvider>
          <div className="flex gap-2">
            <div className="flex-1">
              {product ? (
                <Product product={product} />
              ) : (
                <ShowError error={productError} />
              )}
            </div>
            <div className="flex-1">
              {categoryAttributes ? (
                <CollapsibleComponent
                  className="w-full"
                  heading="Select Available Attributes"
                >
                  <CategoryAttributes categoryAttributes={categoryAttributes} />
                </CollapsibleComponent>
              ) : (
                <ShowError error={categoryAttributesError} />
              )}
            </div>
          </div>
          <AttributeCombinationsTable productId={productId} />
        </AttributeProvider>
      </div>
    </ContainerWithHeading>
  );
};

function Product({
  product,
}: {
  product: Awaited<ReturnType<typeof getProductByIdToAddVariants>>;
}) {
  const { id, pics, name, productSearchability, productVariants } = product;
  return (
    <div className=" w-[40rem] h-fit flex gap-2 border-solid border-teal-400 border-[1px] rounded-sm p-1 m-2">
      <div className="relative h-48 flex-1">
        <Image
          src={pics[0]}
          className="rounded-md"
          alt={name}
          fill
          objectFit="cover"
        />
      </div>
      <div className="mb-2 flex-1">
        <p className="text-xl font-semibold">{name}</p>
        <p className="text-gray-500 text-sm">
          description: {productSearchability?.description}
        </p>
        <p className="my-2">varients</p>
        {productVariants.map((variant) => {
          return (
            <div className="my-2" key={variant.id}>
              <div className="flex gap-1">
                {variant.productVariantToAttributes.map((attribute, index) => {
                  return (
                    <BadgeComponent
                      className=""
                      content={attribute.value}
                      key={index}
                    />
                  );
                })}
                <p>₹ {variant.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CategoryAttributes({
  categoryAttributes,
}: // setSbmitAttributes,
{
  // setSbmitAttributes: () => void;
  categoryAttributes: {
    categoryId: string;
    categoryAttribute: CategoryAttribute;
  }[];
}) {
  const { attributes, updateAttributes, handleValueDelete } =
    useAttributeContext();
  return (
    <div className="border-solid border-teal-400 border-[1px] rounded-sm p-1 m-2">
      {categoryAttributes.map(({ categoryAttribute, categoryId }) => {
        const { description, displayName, id, internalName, possibleValues } =
          categoryAttribute;
        return (
          <div className="flex gap-2" key={id}>
            <h4>{displayName}</h4>
            <p>{internalName}</p>
            <p>{description}</p>
            <div>
              <p>possible values:</p>
              {possibleValues.map((value, index) => {
                const isValueSelected = attributes.some(
                  (attribute) =>
                    attribute.attributeId === id &&
                    attribute.availableIn.includes(value)
                );
                return (
                  <div
                    className={cn(
                      isValueSelected ? "" : "myborder rounded-md",
                      "cursor-pointer"
                    )}
                    key={index}
                  >
                    {isValueSelected ? (
                      <BadgeComponentWithDelete
                        onDelete={() =>
                          handleValueDelete({
                            attributeId: id,
                            value,
                          })
                        }
                        badgeContent={value}
                      />
                    ) : (
                      <div className="flex justify-between">
                        {value}{" "}
                        <Plus
                          onClick={() => {
                            updateAttributes({
                              attributeName: displayName,
                              attributeId: id,
                              value,
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
