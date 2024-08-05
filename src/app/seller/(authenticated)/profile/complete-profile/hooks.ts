import { errorToast, successToast } from "@/app/_components/toast";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { addSellerAddress, isSellerAddressSubmitted } from "./action";
import { useSuccessErrorRedirectHandler } from "@/lib/handleSuccessErrorRedirect";

function useSellerAddressFormHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const [isaddressSubmitted, setIsaddressSubmitted] = useState(false);
  const [result, formAction] = useFormState(addSellerAddress, null);
  const { data, error } = result || {};
  const { formErrors, success } = data || {};
  const hasShownErrorToast = useRef(false);

  useSuccessErrorRedirectHandler({ error, success });

  useEffect(() => {
    if (isaddressSubmitted) redirect("/seller");
  }, [isaddressSubmitted]);

  async function checkIsSellerAddressSubmitted() {
    setIsLoading(true);
    const { data, error } = await isSellerAddressSubmitted();
    if (data) {
      setIsaddressSubmitted(data);
      hasShownErrorToast.current = false;
    } else if (error && !hasShownErrorToast.current) {
      errorToast(error.message, error.name);
      hasShownErrorToast.current = true;
    }
    setIsLoading(false);
  }

  useEffect(() => {
    checkIsSellerAddressSubmitted();
  }, []);

  return {
    isLoading,
    formErrors,
    formAction,
  };
}

export default useSellerAddressFormHandler;
