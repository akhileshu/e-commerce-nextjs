import { useEffect, useState } from "react";
import { getCachedProduct } from "./actions";

export function useAddVariantsHandler(productId:string) {
  const [isSellerAddressSubmittedResult, setIsSellerAddressSubmittedResult] =
    useState<Awaited<ReturnType<typeof getCachedProduct>>>();
    const [product, setProduct] =
      useState<Awaited<ReturnType<typeof getCachedProduct>>>();

  useEffect(() => {
  }, []);
}