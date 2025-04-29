"use client";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
const AccountProfile = dynamic(() => import("."), {
  ssr: false,
}); // import { useGetCurrentUser } from "@/app/shared/hooks/useGetCurrentUser";
// import { redirect } from "next/navigation";

const page = () => {
  //   const { currentUser, loading } = useGetCurrentUser();
  //   console.log(currentUser);

  //   if (!loading && !currentUser?.email) {
  //     redirect("/");
  //   }
  return (
    <Suspense>
      <AccountProfile />;
    </Suspense>
  );
};

export default page;
