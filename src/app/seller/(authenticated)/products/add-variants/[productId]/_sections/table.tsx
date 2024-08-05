import { DialogComponent } from "@/components/dialog";
import { FormSubmitButton } from "@/components/submit-form-button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus, Trash } from "lucide-react";
import { useRef, useState } from "react";
import {
  AttributeCombination,
  getAllPossibleCombinations,
} from "../../../hooks/getCombinations";
import { useAttributeContext } from "../../../hooks/useAttributeContext";
import { useFormState } from "react-dom";
import { addProductVarient } from "../actions";
import { BadgeComponentWithDelete } from "@/components/badge";

export function AttributeCombinationsTable({
  productId,
}: {
  productId: string;
}) {
  const { attributes, updateAttributes, handleValueDelete } =
    useAttributeContext();

  const PossibleAttributeCombinations = getAllPossibleCombinations(attributes);
  const attributeTypes = PossibleAttributeCombinations[0].map(
    (attr) => attr.attributeName
  );

  console.log({ attributes, PossibleAttributeCombinations });

  const getValuesForIndex = (index: number): string[] => {
    if (index >= PossibleAttributeCombinations.length) {
      throw new Error("Index out of range");
    }
    return PossibleAttributeCombinations[index].map(
      (attribute) => attribute.attributeValue
    );
  };

  const handleAttributesCombinationDelete = (index: number) => {
    console.log({ PossibleAttributeCombinations });
    const after = PossibleAttributeCombinations.filter(
      (combination, ind) => ind !== index
    );
    console.log({ after });
  };

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          {attributeTypes.map((type, index) => {
            return <TableHead key={index}>{type}</TableHead>;
          })}
          <TableHead>Delete</TableHead>;
        </TableRow>
      </TableHeader>
      <TableBody>
        {PossibleAttributeCombinations.map((combination, index) => {
          const valuesForIndex = getValuesForIndex(index);
          return (
            <TableRow key={index}>
              {valuesForIndex.map((Attributevalue, ind) => {
                return (
                  <TableCell key={ind} className="font-medium">
                    {Attributevalue}
                  </TableCell>
                );
              })}
              <TableCell className="font-medium">
                <Trash
                  onClick={() => handleAttributesCombinationDelete(index)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <AddVarientForm
                  productId={productId}
                  attributesCombination={combination}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function AddVarientForm({
  attributesCombination,
  productId,
}: {
  attributesCombination: AttributeCombination;
  productId: string;
}) {
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const [productVarientTags, setProductVarientTags] = useState<string[]>([]);

  const productVariantToAttributes = attributesCombination.map(
    ({ attributeId, attributeValue }) => {
      return { categoryAttributeId: attributeId, value: attributeValue };
    }
  );

  const [result, formAction] = useFormState(addProductVarient, null);

  // if (result?.isSaved && dialogCloseRef.current) {
  //   dialogCloseRef.current.click();
  // }

  function handleRemoveTag(index: number) {
    setProductVarientTags((prevTags) => prevTags.filter((_, i) => i !== index));
  }

  function handleAddTag() {
    const newTag = tagInputRef.current?.value;
    if (newTag) {
      setProductVarientTags((prevTags) => [...prevTags, newTag]);
      tagInputRef.current.value = "";
      tagInputRef.current.focus();
    }
  }

  return (
    <DialogComponent
      className="min-w-[70rem]"
      triggerTitle={"Add varient"}
      description={"Add product varient"}
      saveTitle={"save"}
      dialogCloseRef={dialogCloseRef}
    >
      <div className="overflow-y-scroll h-96">
        <div className="divide-x-2 divide-solid flex gap-2">
          {productVariantToAttributes.map(({ value }, ind) => (
            <div key={ind}>{value}</div>
          ))}
        </div>
        <>
          <form className="myborder rounded-md" action={formAction}>
            <input type="hidden" name="productId" value={productId} />
            <input
              type="hidden"
              name="productVariantToAttributes"
              value={JSON.stringify(productVariantToAttributes)}
            />
            <div className="flex gap-2">
              <label htmlFor="price">price :</label>
              <input type="number" name="price" id="price" />
            </div>
            <input
              type="hidden"
              name="tags"
              value={JSON.stringify(productVarientTags)}
            />

            <input
              className="outline-none myborder rounded-md"
              type="text"
              name="description"
              placeholder="Enter description"
            />
            {result?.error?.description && (
              <div className="text-destructive">
                {result?.error?.description}
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {productVarientTags.map((value, valueIndex) => (
                <BadgeComponentWithDelete
                  key={valueIndex}
                  onDelete={() => handleRemoveTag(valueIndex)}
                  badgeContent={value}
                />
              ))}
            </div>

            <div className="flex items-center">
              <input
                className="outline-none myborder w-3/4 rounded-md"
                type="text"
                id={"possibleValueInput"}
                ref={tagInputRef}
                placeholder="Add Product Tag"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <CirclePlus onClick={handleAddTag} className="-mx-10" />
            </div>
            <div>
              <label htmlFor="pics">select upto 3 photos</label>
              <input
                onChange={(e) => console.log(e.target.files)}
                type="file"
                name="pics"
                id="pics"
                accept="image/*"
                multiple
              />
            </div>

            <FormSubmitButton />
          </form>
        </>
      </div>
    </DialogComponent>
  );
}
