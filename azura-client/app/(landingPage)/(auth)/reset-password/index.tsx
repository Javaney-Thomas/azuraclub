"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";

const RESET_PASSWORD = gql`
  mutation ResetPassword($resetToken: String!, $newPassword: String!) {
    resetPassword(resetToken: $resetToken, newPassword: $newPassword)
  }
`;

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Apollo mutation
  const [resetPassword, { loading, error }] = useMutation(RESET_PASSWORD, {
    onCompleted: (data) => {
      toast.success(data.resetPassword);
      router.push("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
    errorPolicy: "all",
  });

  const onSubmit = async (formData: ResetPasswordInputs) => {
    if (!resetToken) {
      toast.error("Invalid or missing reset token");
      return;
    }

    try {
      await resetPassword({
        variables: {
          resetToken,
          newPassword: formData.newPassword,
        },
      });
    } catch (err) {
      // Unexpected errors
      console.error("Reset password error:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Reset Password
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Enter a new password to complete your reset
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* New Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded transition"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {/* GraphQL errors */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error.message}
        </div>
      )}
    </div>
  );
}
