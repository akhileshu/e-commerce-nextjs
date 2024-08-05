import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";

export function BadgeComponent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return <Badge className={cn(className)}>{content}</Badge>;
}
export function BadgeComponentWithDelete({
  badgeContent,
  onDelete,
}: {
  badgeContent: String;
  onDelete: () => void;
}) {
  return (
    <Badge>
      {badgeContent}
      <CircleX onClick={onDelete} className="ml-2" size={"20px"} />
    </Badge>
  );
}
