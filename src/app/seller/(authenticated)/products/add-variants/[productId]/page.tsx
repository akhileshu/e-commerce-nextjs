import { AddVariants } from "./_sections/add-varients";
import { getCachedProduct, getCategoryAttributes } from "./actions";

async function page({
  params: { productId },
}: {
  params: { productId: string };
}) {
  return (
    <AddVariants
      categoryAttributes={await getCategoryAttributes(productId)}
      product={await getCachedProduct(productId)}
      productId={productId}
    />
  );
}

export default page;
