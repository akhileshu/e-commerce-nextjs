"use client";
import { revalidatePath, revalidateTag } from "next/cache";
import React from "react";
import action from "./action";

export function Client() {
  return (
    <button
      className="myborder"
      onClick={()=>action()}
      // onClick={async () => {
      //   action();
      //   // revalidateTag("number");
      // }}
    >
      revalidae number
    </button>
  );
}

export default Client;
