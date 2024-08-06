import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";



export function CategoryAttributesTable({children:tableBodyContent}:{children:ReactNode}) {
  return (
    <Table>
      <TableCaption>Select Attributes to add product variants</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Attribute Details</TableHead>
          <TableHead className="text-right">
            Attribute Possible values
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{tableBodyContent}</TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
}
