"use client";

import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { toast } from "sonner";
import client from "@/app/lib/apollo-client";

const CREATE_USER = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $password: String!
    $role: String
  ) {
    createUser(name: $name, email: $email, password: $password, role: $role) {
      name
      email
      role
    }
  }
`;

type FormValues = {
  name: string;
  email: string;
  password: string;
  role: string;
};

export default function CreateUserForm({
  setShowModal,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [createUser] = useMutation(CREATE_USER);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: FormValues) => {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await createUser({ variables: data });
      setSuccessMsg(`User ${res.data.createUser.name} created successfully.`);
      client.resetStore();
      setShowModal(false);
      toast.success("User created successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Create New User</h2>

      {successMsg && <div className="text-green-600 mb-4">{successMsg}</div>}
      {errorMsg && <div className="text-red-600 mb-4">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: 6,
            })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            {...register("role")}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primaryx text-white py-2 px-4 rounded-lg hover:bg-primaryx-hover cursor-pointer transition"
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
