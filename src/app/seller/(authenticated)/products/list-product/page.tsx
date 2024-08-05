import { ContainerWithHeading } from "@/app/_components/seller-form";
import { getCategoryWithChildren } from "@/data-access/category";
import { SelectCategoryAndBrand } from "../_components/select-category-and-brand";
import { CategoryBrandProvider } from "../_components/selected-category-context";
import { AddProductForm } from "./_sections/add-product-form";

export default async function page() {
  const rootCategory = await getCategoryWithChildren();

  return (
    <div>
      <CategoryBrandProvider>
        <ContainerWithHeading heading="Add a Product">
          <SelectCategoryAndBrand rootCategory={rootCategory} />
          <AddProductForm />
        </ContainerWithHeading>
      </CategoryBrandProvider>
    </div>
  );
}
