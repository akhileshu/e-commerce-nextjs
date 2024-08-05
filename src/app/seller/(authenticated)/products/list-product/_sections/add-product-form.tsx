"use client";
import { BadgeComponentWithDelete } from "@/components/badge";
import { FormSubmitButton } from "@/components/submit-form-button";
import { useSuccessErrorRedirectHandler } from "@/lib/handleSuccessErrorRedirect";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useCategoryBrand } from "../../_components/selected-category-context";
import { listAProduct } from "../actions";
import { Field, FieldInput, FieldLabel } from "@/app/_components/seller-form";

const useProductFormHandler = () => {
  const { selectedCategoryBrand, setSelectedCategoryBrand } =
    useCategoryBrand();
  const productTagInputRef = useRef<HTMLInputElement | null>(null);
  const [productTags, setProductTags] = useState<string[]>([]);

  const [result, formAction] = useFormState(listAProduct, null);

  const { data, error } = result || {};
  const { formErrors, success } = data || {};

  useSuccessErrorRedirectHandler({ success, error });

  const handleAddProductTag = () => {
    const newProductTag = productTagInputRef.current?.value;

    if (newProductTag) {
      setProductTags((previousProductTags) => [
        ...previousProductTags,
        newProductTag,
      ]);
      productTagInputRef.current!.value = "";
      productTagInputRef.current!.focus();
    }
  };

  const handleRemoveProductTag = (removeProductTagIndex: number) => {
    setProductTags((previousProductTags) =>
      previousProductTags.filter((tag, index) =>
        index !== removeProductTagIndex ? tag : null
      )
    );
  };

  return {
    selectedCategoryBrand,
    formAction,
    productTagInputRef,
    productTags,
    formErrors,
    success,
    handleAddProductTag,
    handleRemoveProductTag,
  };
};

export function AddProductForm() {
  const {
    selectedCategoryBrand,
    formAction,
    productTagInputRef,
    productTags,
    formErrors,
    handleAddProductTag,
    handleRemoveProductTag,
  } = useProductFormHandler();

  const { brandId, brandName, categoryHierarchy, categoryId, categoryName } =
    selectedCategoryBrand || {};

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  return categoryId && brandId ? (
    <>
      <form className="m-2" action={formAction}>
        <input type="hidden" name="categoryId" value={categoryId} />
        <input type="hidden" name="tags" value={JSON.stringify(productTags)} />
        <input type="hidden" name="brandId" value={brandId} />
        <Field error={formErrors?.name}>
          <FieldLabel htmlFor="name" labelText="Enter name" />
          <FieldInput type="text" id="name" name="name" />
        </Field>
        <Field error={formErrors?.description}>
          <FieldLabel htmlFor="description" labelText="Enter description" />
          <textarea
            className="outline-none min-w-72 m-2 px-2 py-1 border-solid border-[1px] border-teal-400 rounded-md"
            name="description"
            id="description"
          />
        </Field>

        <div className="flex gap-2 flex-wrap">
          {productTags.map((value, valueIndex) => (
            <BadgeComponentWithDelete
              key={valueIndex}
              onDelete={() => handleRemoveProductTag(valueIndex)}
              badgeContent={value}
            />
          ))}
        </div>

        <Field error={formErrors?.tags}>
          <FieldLabel
            htmlFor="possibleValueInput"
            labelText="Add Product Tag"
          />
          <div className="relative flex items-center">
            <FieldInput
              type="text"
              id={"possibleValueInput"}
              myRef={productTagInputRef}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAddProductTag();
                }
              }}
            />
            <CirclePlus
              onClick={handleAddProductTag}
              className="absolute right-3"
            />
          </div>
        </Field>
        <Field error={formErrors?.pics}>
          <FieldLabel htmlFor="pics" labelText="select upto 3 photos" />
          <input
            className="m-2 max-w-72"
            onChange={handleImageChange}
            type="file"
            name="pics"
            id="pics"
            accept="image/*"
            multiple
          />
        </Field>
        <Field className="flex gap-2 my-2">
          {selectedImages.map((file, index) => (
            <div key={index} className=" ">
              <Image
                width={100}
                height={100}
                objectFit="cover"
                src={URL.createObjectURL(file)}
                alt={`Selected ${index}`}
                className="border-solid border-[1px] rounded-sm border-teal-400 p-2"
              />
            </div>
          ))}
        </Field>

        <FormSubmitButton className="" />
      </form>
    </>
  ) : null;
}
