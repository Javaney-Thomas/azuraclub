"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { setCookie } from "cookies-next";
import { toast } from "sonner";
import { AuthProps } from "..";
import client from "@/app/lib/apollo-client";
import { REGISTER_USER } from "@/app/shared/utils/queries";

const signupSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

export default function Signup({ setCloseModal, setAuthState }: AuthProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const [registerUser, { loading, error }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      setCookie("token", data.register.token, { maxAge: 60 * 60 * 24 }); // 1 day
      client.resetStore();
      toast.success("Signup successful!");
      setCloseModal?.(false);
    },
    onError: (err) => {
      toast.error(err.message || "Signup failed. Please try again.");
    },
    errorPolicy: "all",
  });

  const onSubmit = async (formData: SignupFormInputs) => {
    try {
      await registerUser({ variables: formData });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        <h1 className="text-center text-2xl text-gray-600 font-medium mb-10">
          Create an account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-gray-700 text-lg font-medium mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-lg font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 mb-6"
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center border-t border-gray-200 pt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setAuthState?.("login")}
              className="text-teal-500 hover:underline"
            >
              Login
            </button>
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
