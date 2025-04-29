"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { setCookie } from "cookies-next";
import { toast } from "sonner";
import { AuthProps } from "..";
import { LOGIN_USER } from "@/app/shared/utils/queries";
import client from "@/app/lib/apollo-client";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login({ setCloseModal, setAuthState }: AuthProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  // const { refetch } = useGetCurrentUser();

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
    // On successful login
    onCompleted: (data) => {
      setCookie("token", data.login.token, { maxAge: 60 * 60 * 24 }); // 1 day
      // Reset the store to revalidate all queries (including current user)
      client.resetStore();

      toast.success("Login successful!");
      setCloseModal?.(false);
    },
    onError: (err) => {
      toast.error(err.message || "Login failed. Please try again.");
    },
    errorPolicy: "all",
  });

  // Form submission
  const onSubmit = async (formData: LoginFormInputs) => {
    try {
      await loginUser({ variables: formData });
    } catch (err) {
      // This catch block only handles unexpected issues outside of Apollo
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        <h1 className="text-center text-2xl text-gray-600 font-medium mb-10">
          Login with your email &amp; password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 text-lg font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="customer@demo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="text-gray-700 text-lg font-medium"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setAuthState?.("forgotPassword")}
                className="text-teal-500 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 mb-6"
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        {/* Or Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Buttons */}
        {/* <button
          type="button"
          className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 mb-4"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
            />
          </svg>
          Login with Google
        </button> */}
        {/* <button
          type="button"
          className="w-full flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 mb-8"
        >
          <Smartphone />
          Login with Mobile number
        </button> */}

        {/* Register Link */}
        <div className="text-center border-t border-gray-200 pt-6">
          <p className="text-gray-600">
            Don&apos;t have any account?{" "}
            <button
              type="button"
              onClick={() => setAuthState?.("signup")}
              className="text-teal-500 hover:underline"
            >
              Register
            </button>
          </p>
        </div>

        {/* Fallback Error Message (if needed) */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
