"use client";
import React, { useState } from "react";
import Login from "./signin";
import Signup from "./signup";
import ForgotPassword from "./forgottenPassword";
import ResetPasswordSent from "./ResetPasswordSent";

export interface AuthProps {
  setCloseModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setAuthState?: React.Dispatch<
    React.SetStateAction<
      | "login"
      | "signup"
      | "forgotPassword"
      | "resetPassword"
      | "resetPasswordSent"
    >
  >;
}

const Auth = ({ setCloseModal }: AuthProps) => {
  const [authState, setAuthState] = useState<
    | "login"
    | "signup"
    | "forgotPassword"
    | "resetPassword"
    | "resetPasswordSent"
  >("login");

  return (
    <div>
      {authState === "login" && (
        <Login setAuthState={setAuthState} setCloseModal={setCloseModal} />
      )}
      {authState === "signup" && (
        <Signup setAuthState={setAuthState} setCloseModal={setCloseModal} />
      )}
      {authState === "forgotPassword" && (
        <ForgotPassword
          setAuthState={setAuthState}
          setCloseModal={setCloseModal}
        />
      )}
      {authState === "resetPasswordSent" && (
        <ResetPasswordSent setAuthState={setAuthState} />
      )}
    </div>
  );
};

export default Auth;
