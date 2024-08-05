import { errorToast, successToast } from "@/app/_components/toast";
import { FormatedError } from "@/error-handling/wrap-with-try-catch";
import { ActionSuccessBase } from "@/types/shared";
import { redirect } from "next/navigation";
import { useEffect } from "react";


interface Params<S extends ActionSuccessBase> {
  success?: S | null;
  error?: (FormatedError & { redirectPath?: string }) | null;
}


export function useSuccessErrorRedirectHandler<S extends ActionSuccessBase>({error,success}:Params<S>) {
  useEffect(() => {
    const { message: successMessage, redirectPath: successRedirectPath } =
      success || {};
    if (successMessage) {
      successToast(successMessage);
      if (successRedirectPath) redirect(successRedirectPath);
    } else if (error) {
      const { message, name, redirectPath } = error || {};
      errorToast(message, name);
      if (redirectPath) redirect(redirectPath);
    }
  }, [error, success]);
}
