"use client";
import { getChildren } from "@/data-access/category";
import { cn } from "@/lib/utils";
import { CategoryWithChildren } from "@/types/category";
import { Category } from "@prisma/client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useBrands } from "../hooks/use-brand";
import { CollapsibleComponent } from "./collapsible";
import { useCategoryBrand } from "./selected-category-context";

function CategoryComponent({
  category,
  className,
  categoryHierarchy = [],
}: {
  category: CategoryWithChildren;
  // category: getCategoryWithChildrenType;
  className?: string;
  categoryHierarchy?: string[];
}) {
  const { selectedCategoryBrand, setSelectedCategoryBrand } =
    useCategoryBrand();
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null
  );

  const handleCategoryHover = (categoryId: string) => {
    setHoveredCategoryId(categoryId);
  };

  const { id, children, name, parent, searchability } = category || {};

  useEffect(() => {
    console.log({ selectedCategoryBrand });
  }, [selectedCategoryBrand]);

  if (!category || !id || !name) return;
  return (
    <div className={cn(className, "text-sm")}>
      <div
        className={`flex rounded-sm justify-between items-center mx-2 my-1 px-2 shadow-standard hover:bg-gray-100`}
        onMouseEnter={() => handleCategoryHover(id)}
        onMouseLeave={() => setHoveredCategoryId(null)}
      >
        <span>{name}</span>
        <button
          className={`bg-white rounded-sm m-2 p-1 shadow-standard `}
          onClick={() => {
            categoryHierarchy.push(category.name);
            setSelectedCategoryBrand({
              categoryId: id,
              categoryHierarchy,
              categoryName: name,
              brandId: null,
              brandName: null,
            });
          }}
        >
          select
        </button>
      </div>

      {children?.length > 0 && (
        <CategoryChildren
          categoryHierarchy={[...categoryHierarchy, name]}
          initialCategories={category.children}
        />
      )}
    </div>
  );
}

const CategoryChildren = ({
  initialCategories,
  className,
  categoryHierarchy = [],
}: {
  initialCategories: Category[];
  categoryHierarchy?: string[];
  className?: string;
}) => {
  const [categories, setCategories] = useState(initialCategories);
  const [interactiveIcon, setInteractiveIcon] = useState(<ChevronRight />);

  const loadChildren = async (category: Category) => {
    let children: Category[] =
      category.children ?? (await getChildren(category.id));

    setCategories((prevCategories) => {
      if (category.children) {
        setInteractiveIcon(<ChevronRight />);
        return initialCategories;
      }
      setInteractiveIcon(<ChevronDown />);
      const clickedCategoryWithChildren = [{ ...category, children }];
      return clickedCategoryWithChildren;
    });
  };

  return (
    <div>
      {categories.map((category, index) => (
        <div className="flex items-center ml-5" key={index}>
          <span
            className={` hover:text-blue-500 cursor-pointer`}
            onClick={() => loadChildren(category)}
          >
            {interactiveIcon}
          </span>
          <CategoryComponent
            categoryHierarchy={categoryHierarchy}
            className={cn(className, "w-full")}
            category={category}
          />
        </div>
      ))}
    </div>
  );
};

function SelectBrand() {
  const { selectedCategoryBrand, setSelectedCategoryBrand } =
    useCategoryBrand();
  const categoryId = selectedCategoryBrand?.categoryId;


  const brands = useBrands(categoryId);

  return (
    <div className={`shadow-standard flex rounded-sm justify-between m-2 p-2`}>
      {!categoryId ? (
        <p className="text-gray-400 text-sm m-2 p-2">
          Associated Brands will appear here!
        </p>
      ) : (
        <div className="max-w-[20rem] overflow-y-scroll max-h-[20rem] scrollbar-thin  scrollbar-track-transparent scrollbar-thumb-blue-500 ">
          <div className="m-2">
            <p className="text-gray-400 text-sm m-4">
              Select from below brands
            </p>

            <div className="flex flex-wrap gap-2">
              {brands.map(({ brand }, index) => {
                const { id, name } = brand;
                return (
                  <div
                    className={`shadow-standard rounded-sm p-1 cursor-pointer hover:bg-gray-100`}
                    onClick={() =>
                      setSelectedCategoryBrand((prev) => ({
                        ...prev,
                        brandId: id,
                        brandName: name,
                      }))
                    }
                    key={index}
                  >
                    {name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SelectCategoryAndBrand({
  rootCategory,
}: {
  rootCategory: CategoryWithChildren;
}) {
  return (
    <div className={`shadow-standard rounded-md m-2 p-2`}>
      <CollapsibleComponent>
        <div className="flex">
          <CategoryComponent className="" category={rootCategory} />
          <SelectBrand />
        </div>
      </CollapsibleComponent>
    </div>
  );
}
