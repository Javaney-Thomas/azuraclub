"use client";
import React from "react";
import { AuthProps } from "..";

export default function ResetPasswordSent({ setAuthState }: AuthProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">Email Sent</h2>
      <p className="text-center text-gray-600 mb-6">
        If an account exists for your email, we have sent a password reset link
        to your inbox.
      </p>
      <div className="text-center">
        <button
          onClick={() => setAuthState?.("login")}
          className="text-teal-500 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
