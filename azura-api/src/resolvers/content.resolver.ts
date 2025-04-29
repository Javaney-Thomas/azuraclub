import { IResolvers } from "@graphql-tools/utils";
import Content from "../models/content.model";

const contentResolvers: IResolvers = {
  Query: {
    content: async (_parent, { key }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      const content = await Content.findOne({ key });
      if (!content) {
        throw new Error("Content not found");
      }
      return content;
    },
    allContent: async (_parent, _args, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      return await Content.find({});
    },
  },
  Mutation: {
    updateContent: async (_parent, { key, value }, { user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized");
      }
      // Upsert: update existing content or create a new one if it doesn't exist.
      const content = await Content.findOneAndUpdate(
        { key },
        { value },
        { new: true, upsert: true }
      );
      return content;
    },
  },
};

export default contentResolvers;
