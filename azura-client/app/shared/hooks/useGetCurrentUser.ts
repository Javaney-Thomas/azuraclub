"use client";
import client from "@/app/lib/apollo-client";
import { useQuery } from "@apollo/client";
import { deleteCookie, getCookie } from "cookies-next";
import { GET_USER_PROFILE } from "../utils/queries";
import { useRouter } from "next/navigation";

export function useGetCurrentUser() {
  const router = useRouter();
  const token = getCookie("token");

  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    skip: !token,
    fetchPolicy: "cache-and-network", // ensures data is up-to-date
    // onError: (error) => {
    //   if (!token && error.message === "Not authenticated") {
    //     toast("Not authenticated");
    //   }
    //   toast("Not authenticated");

    //   // Handle other errors
    // },
  });

  const logout = () => {
    deleteCookie("token");
    // client.clearStore();
    // client.resetStore();
    client.cache.evict({ id: "ROOT_QUERY", fieldName: "profile" });
    client.cache.gc(); // Garbage collect removed items

    router.push("/");
  };

  return {
    currentUser: data ? data.profile : null,
    loading,
    error,
    refetch,
    logout,
  };
}
