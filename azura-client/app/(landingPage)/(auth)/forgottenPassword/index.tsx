"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { AuthProps } from "..";

const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword({ setAuthState }: AuthProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [forgotPassword, { loading, error }] = useMutation(FORGOT_PASSWORD, {
    onCompleted: (data) => {
      toast.success(data.forgotPassword);
      setAuthState?.("resetPasswordSent");
    },
    onError: (err) => {
      toast.error(err.message || "Error sending password reset email");
    },
  });

  const onSubmit = async (formData: ForgotPasswordInputs) => {
    try {
      await forgotPassword({ variables: { email: formData.email } });
    } catch (err) {
      // Catch any unexpected errors
      console.error("Forgot password error:", err);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-center mb-2">
        Forgot Password
      </h2>
      <p className="text-center text-gray-500 mb-6">
        We&apos;ll send you a link to reset your password
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="customer@demo.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded transition"
        >
          {loading ? "Sending..." : "Submit Email"}
        </button>
      </form>

      <div className="text-center mt-6">
        <span className="text-gray-600 mr-1">Back to</span>
        <button
          className="text-teal-500 hover:underline"
          onClick={() => setAuthState?.("login")}
        >
          Login
        </button>
      </div>

      {/* Optional GraphQL error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error.message}
        </div>
      )}
    </div>
  );
}
