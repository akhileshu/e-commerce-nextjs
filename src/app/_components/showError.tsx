import { FormatedError } from "@/error-handling/wrap-with-try-catch";
import { aestheticBoxShadow } from "@/lib/css";
import { cn } from "@/lib/utils";
import { ServerCrash } from "lucide-react";

function ShowError({
  error,
  className,
}: {
  error: FormatedError;
  className?: string;
}) {
  return error ? (
    <div
      className={cn(
        className,
        `flex gap-4 items-center ${aestheticBoxShadow} mx-auto max-w-xl my-4 p-4 gap-4 rounded-md`
      )}
    >
      <ServerCrash size={40} color="#ff5c5c" />
      <div className={`flex flex-col gap-4`}>
        <p className="font-medium">{error.message}</p>
        <p className="text-red-500 text-sm">{error.name}</p>
      </div>
    </div>
  ) : null;
}

export default ShowError;
