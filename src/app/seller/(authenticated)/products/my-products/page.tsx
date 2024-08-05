import { getAllSellerProductsFromDB } from "@/data-access/product";
import Image from "next/image";
import React from "react";

export default async function AllSellerProducts() {
  const products = await getAllSellerProductsFromDB();
  return (
    <div className="myborder rounded-md w-fit">
      <h2>Your listed Products</h2>
      {!products.length ? (
        <p>No products</p>
      ) : (
        products.map((product, ind) => {
          const {
            brandId,
            categoryId,
            createdAt,
            id,
            sellerId,
            statusName,
            updatedAt,
            name,
            pics,
          } = product;
          return (
            <div key={ind} className="flex gap-2 myborder">
              <Image src={pics[0]} alt={name} width={300} height={400} />
              <div>
                <h3>{name}</h3>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
