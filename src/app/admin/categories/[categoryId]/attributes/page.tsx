import React from "react";
import { AddAttributeToCategory } from "../../../_shared/categories/_components/attributes/add-attribute-to-category";
import { AllAttributesOfACategory } from "../../../_shared/categories/_components/attributes/get-attributes-of-category";
import { getCategoryAttributesByProductId } from "@/data-access/categoryAttribute";

async function page({
  params,
  searchParams,
}: {
  params: { categoryId: string };
  searchParams: { categoryData: string };
}) {
  const { categoryId } = params;
  const { name: categoryName } = JSON.parse(searchParams.categoryData);
  const attributes = await getCategoryAttributesByProductId({ categoryId });
  return (
    <div>
      <h1>
        <p>{`category-attributes page for ${categoryName} category`}</p>
        <AddAttributeToCategory categoryId={categoryId} />
        <AllAttributesOfACategory
          attributes={attributes}
          categoryId={categoryId}
        />
      </h1>
    </div>
  );
}

export default page;
