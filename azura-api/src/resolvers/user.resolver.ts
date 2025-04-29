import { IResolvers } from "@graphql-tools/utils";
import User from "../models/user.model";

const userResolvers: IResolvers = {
  Query: {
    // Fetch all users (admin-only access)
    users: async (_parent, _args, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }

      try {
        return await User.find({});
      } catch (error) {
        throw new Error("Failed to fetch users");
      }
    },
    // Fetch a single user by ID (admin-only access)
    user: async (_parent, { id }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }

      try {
        return await User.findById(id);
      } catch (error) {
        throw new Error("Failed to fetch user");
      }
    },
  },
  Mutation: {
    // Update a user's role (admin-only access)
    updateUserRole: async (_parent, { id, role }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }

      try {
        return await User.findByIdAndUpdate(id, { role }, { new: true });
      } catch (error) {
        throw new Error("Failed to update user role");
      }
    },
    // Delete a user (admin-only access)
    deleteUser: async (_parent, { id }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }

      try {
        await User.findByIdAndDelete(id);
        return "User deleted successfully";
      } catch (error) {
        throw new Error("Failed to delete user");
      }
    },
  },
};

export default userResolvers;
