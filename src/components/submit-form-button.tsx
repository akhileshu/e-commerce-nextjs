import LoadingSpinner from "@/app/_components/loading-spinner";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function FormSubmitButton({
  className,
  label = "Submit",
}: {
  className?: string;
  label?: string | ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={cn(className, "hover:bg-teal-500 min-w-20 bg-teal-400 px-2 text-white py-1 rounded-md")}
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? <LoadingSpinner/> : <>{label}</>}
    </button>
  );
}
