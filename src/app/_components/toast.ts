import { toast } from "sonner";

export function successToast(message: string, description?: string) {
  return toast.success(message, {
    position: "top-center",
    description: description || undefined,
  });
}
export function errorToast(message: string, description?: string) {
  return toast.error(message, {
    position: "top-center",
    description: description || undefined,
  });
}
