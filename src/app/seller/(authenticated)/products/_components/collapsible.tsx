"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCategoryBrand } from "./selected-category-context";
import { BreadcrumbComponent } from "@/components/breadcrumb";
import { cn } from "@/lib/utils";

export function CollapsibleComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { selectedCategoryBrand, setSelectedCategoryBrand } =
    useCategoryBrand();
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-fit space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">select category and brand</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div
        className={cn(
          "rounded-md border px-4 py-3 font-mono text-sm",
          selectedCategoryBrand?.brandId ? "" : "hidden"
        )}
      >
        {selectedCategoryBrand?.brandId ? (
          <div>
            <BreadcrumbComponent
              items={selectedCategoryBrand?.categoryHierarchy}
              title="category"
            />
            <div>Brand: {selectedCategoryBrand?.brandName}</div>
          </div>
        ) : null}
      </div>
      <CollapsibleContent className="space-y-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}
