import { IResolvers } from "@graphql-tools/utils";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User, { IUser } from "../models/user.model";
import { generateToken } from "../utils/jwt.util";
import { sendEmail } from "../utils/mailer.util";

const authResolvers: IResolvers = {
  Query: {
    // Retrieves the current user's profile from the JWT payload in context.
    profile: async (_parent, _args, { user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }

      try {
        const foundUser = await User.findById(user.id);
        if (!foundUser) {
          throw new Error("User not found");
        }
        return foundUser;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error("Error fetching user profile: " + error.message);
        }
        throw new Error("Error fetching user profile");
      }
    },
  },
  Mutation: {
    // Registers a new user, hashes their password, and returns a JWT.
    register: async (_parent, { name, email, password }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
          role: "user",
        });
        const token = generateToken(newUser);
        return { token, user: newUser };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error("Error during registration: " + error.message);
        }
        throw new Error("Error during registration");
      }
    },
    // Logs in a user by verifying credentials and generating a JWT.
    login: async (_parent, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error("Invalid password");
        }
        const token = generateToken(user);
        return { token, user };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error("Error during login: " + error.message);
        }
        throw new Error("Error during login");
      }
    },
    // Updates the authenticated user's profile.
    updateProfile: async (_parent, args, { user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }
      try {
        const updatedUser = await User.findByIdAndUpdate(user.id, args, {
          new: true,
        });
        if (!updatedUser) {
          throw new Error("User not found");
        }
        return updatedUser;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error("Error updating profile: " + error.message);
        }
        throw new Error("Error updating profile");
      }
    },
    // Password reset process (forgot password).
    forgotPassword: async (_parent, { email }) => {
      console.log({ email });

      try {
        const user = await User.findOne({ email });
        if (!user) {
          return "If that email address is in our system, we have sent a password reset link.";
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiry

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
        const subject = "Password Reset Request";
        const html = `
          <p>You requested a password reset.</p>
          <p><a href="${resetLink}">Click here to reset your password</a></p>
          <p>This link will expire in 1 hour.</p>
        `;

        await sendEmail(user.email, subject, html);
        return "If that email address is in our system, we have sent a password reset link.";
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            "Error sending password reset email: " + error.message
          );
        }
        throw new Error("Error sending password reset email");
      }
    },
    // Resets the user's password using the provided reset token.
    resetPassword: async (_parent, { resetToken, newPassword }) => {
      try {
        const user = await User.findOne({
          resetPasswordToken: resetToken,
          resetPasswordExpires: { $gt: new Date() },
        });
        if (!user) {
          throw new Error("Password reset token is invalid or has expired");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return "Password has been reset successfully";
      } catch (error) {
        if (error instanceof Error) {
          throw new Error("Error resetting password: " + error.message);
        }
        throw new Error("Error resetting password");
      }
    },
  },
};

export default authResolvers;
