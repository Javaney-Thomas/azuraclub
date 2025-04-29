"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { UPDATE_USER_ROLE } from "@/app/shared/utils/queries";
import client from "@/app/lib/apollo-client";
import { toast } from "sonner";

type FormValues = {
  role: string;
};

export default function UpdateUserRoleForm({
  id,
  setShowModal,
}: {
  id: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [updateUserRole] = useMutation(UPDATE_USER_ROLE);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: FormValues) => {
    setErrorMsg("");
    setSuccessMsg("");
    const dataToSend = { id, ...data };

    console.log(dataToSend, "dataToSend");

    try {
      const res = await updateUserRole({ variables: dataToSend });

      client.resetStore();
      toast.success(
        `User ${res.data.updateUserRole.name}'s role updated to ${res.data.updateUserRole.role}.`
      );
      setShowModal(false);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Update User Role</h2>

      {successMsg && <div className="text-green-600 mb-4">{successMsg}</div>}
      {errorMsg && <div className="text-red-600 mb-4">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            {...register("role", { required: "Role is required" })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
          >
            <option value="">Select role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primaryx text-white py-2 px-4 rounded-lg hover:bg-primaryx-hover transition"
        >
          {isSubmitting ? "Updating..." : "Update Role"}
        </button>
      </form>
    </div>
  );
}
