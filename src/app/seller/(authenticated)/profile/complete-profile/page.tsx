"use client";
import AddressForm, { AddressField } from "@/app/_components/address-form";

import LoadingSpinner from "@/app/_components/loading-spinner";
import useSellerAddressFormHandler from "./hooks";
import { ContainerWithHeading } from "@/app/_components/seller-form";

function page() {
  return (
    <ContainerWithHeading heading="Submit Address and Contact">
      <SellerAddressForm />
    </ContainerWithHeading>
  );
}

function SellerAddressForm() {
  const { isLoading, formErrors, formAction } = useSellerAddressFormHandler();
  const { phoneNumber: phoneNumberFieldError, ...addressFieldErrors } =
    formErrors || {};

  if (isLoading) return <LoadingSpinner className="h-screen" />;
  return (
    <AddressForm
      fieldErrors={addressFieldErrors}
      formAction={formAction}
      type="SellerAddress"
    >
      <>
        <AddressField fieldError={phoneNumberFieldError}>
          <>
            <label className="text-gray-500 min-w-32" htmlFor="phoneNumber">
              Phone Number:
            </label>
            <input
              className="max-w-60 focus:border-purple-400 p-1 outline-none border-purple-200 border-2 border-solid rounded-sm"
              name="phoneNumber"
              type="number"
              id="phoneNumber"
            />
          </>
        </AddressField>
      </>
    </AddressForm>
  );
}
export default page;
