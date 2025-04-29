import { IResolvers } from "@graphql-tools/utils";
import Product from "../models/product.model";
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary";

const logInfo = (message: string, data?: any) => {
  console.info("[INFO]", message, data || "");
};
const logError = (message: string, error?: any) => {
  console.error("[ERROR]", message, error || "");
};

const productResolvers: IResolvers = {
  Query: {
    // Fetch products with optional filtering and pagination.
    products: async (_parent, args) => {
      try {
        const { category, search, page = 1, limit = 10 } = args;
        const query: any = {};
        if (category) query.category = category;
        if (search) {
          query.title = { $regex: search, $options: "i" };
        }
        logInfo("Fetching products", { query, page, limit });
        const products = await Product.find(query)
          .skip((page - 1) * limit)
          .limit(limit);
        logInfo("Fetched products successfully", { count: products.length });
        return products;
      } catch (error) {
        logError("Failed to fetch products", error);
        throw new Error("Failed to fetch products");
      }
    },

    // Return total number of products matching the filter.
    productsCount: async (_parent, args) => {
      try {
        const { category, search } = args;
        const query: any = {};
        if (category) query.category = category;
        if (search) {
          query.title = { $regex: search, $options: "i" };
        }
        const count = await Product.countDocuments(query);
        logInfo("Fetched products count", { count });
        return count;
      } catch (error) {
        logError("Failed to fetch products count", error);
        throw new Error("Failed to fetch products count");
      }
    },
    // Fetch a single product by its ID.
    product: async (_parent, { id }) => {
      try {
        const product = await Product.findById(id);
        if (!product) {
          logError("Product not found", { id });
          throw new Error("Product not found");
        }
        logInfo("Fetched product successfully", { id });
        return product;
      } catch (error) {
        logError("Failed to fetch product", error);
        throw new Error("Failed to fetch product");
      }
    },
  },
  Mutation: {
    // Create a new product.
    createProduct: async (
      _parent,
      { input: { title, category, price, stock, description }, file },
      { user }
    ) => {
      if (!user || user.role !== "admin") {
        throw new Error("Not authorized to create products");
      }
      // logInfo("product ", { title, category, price, stock, file, user });

      if (!title || !category || !file) {
        throw new Error(
          "Missing required fields: title, category, and image file"
        );
      }

      if (price <= 0) {
        throw new Error("Price must be greater than 0");
      }

      if (stock < 0) {
        throw new Error("Stock cannot be negative");
      }

      try {
        // Upload image to Cloudinary
        const { createReadStream } = await file;
        console.log({ createReadStream });
        const stream = createReadStream();
        const imageUrl = await uploadToCloudinary(stream);
        console.log({ imageUrl });

        // Create product with image URL
        const product = await Product.create({
          title,
          category,
          price,
          description,
          stock,
          imageUrl,
        });

        return product;
      } catch (error) {
        console.log(error);

        throw new Error("Failed to create product");
      }
    },
    // Update an existing product.
    updateProduct: async (_parent, { id, ...updates }, { user }) => {
      if (!user || (user.role !== "admin" && user.role !== "vendor")) {
        logError("Unauthorized access attempt to update product", { user });
        throw new Error("Not authorized to update products");
      }
      if (updates.price !== undefined && updates.price <= 0) {
        throw new Error("Price must be greater than 0");
      }
      if (updates.stock !== undefined && updates.stock < 0) {
        throw new Error("Stock cannot be negative");
      }
      try {
        logInfo("Updating product", updates.input);
        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          updates.input,
          {
            new: true,
          }
        );
        if (!updatedProduct) {
          logError("Product not found for update", { id });
          throw new Error("Product not found");
        }
        logInfo("Product updated successfully", {
          productId: updatedProduct.id,
        });
        return updatedProduct;
      } catch (error) {
        logError("Failed to update product", error);
        throw new Error("Failed to update product");
      }
    },
    // Delete a product.
    deleteProduct: async (_parent, { id }, { user }) => {
      if (!user || user.role !== "admin") {
        logError("Unauthorized access attempt to delete product", { user });
        throw new Error("Not authorized to delete products");
      }
      try {
        logInfo("Deleting product", { productId: id });
        // Find the product to get the image URL
        const product = await Product.findById(id);
        if (!product) {
          logError("Product not found for deletion", { id });
          throw new Error("Product not found");
        }
        // Delete the image from Cloudinary if it exists
        if (product.imageUrl) {
          const publicId = product.imageUrl.split("/").pop()?.split(".")[0];
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        }
        // Delete the product from the database
        await Product.findByIdAndDelete(id);
        logInfo("Product deleted successfully", { productId: id });
        return product;
      } catch (error) {
        logError("Failed to delete product", error);
        throw new Error("Failed to delete product");
      }
    },
    // Upload a product image.
    uploadProductImage: async (_parent, { file }) => {
      try {
        const { createReadStream } = await file;
        const stream = createReadStream();
        logInfo("Uploading product image to Cloudinary");
        const imageUrl = await uploadToCloudinary(stream);
        logInfo("Image uploaded successfully", { imageUrl });
        return imageUrl;
      } catch (error) {
        logError("Failed to upload product image", error);
        throw new Error("Failed to upload product image");
      }
    },

    updateProductImage: async (_parent, { id, file }, { user }) => {
      if (!user || (user.role !== "admin" && user.role !== "vendor")) {
        throw new Error("Not authorized to update product image");
      }
      try {
        const product = await Product.findById(id);
        if (!product) {
          throw new Error("Product not found");
        }

        // Delete the old image from Cloudinary
        if (product.imageUrl) {
          const publicId = product.imageUrl.split("/").pop()?.split(".")[0]; // Extract public ID
          console.log({ publicId });
          if (publicId) {
            const deletedImageRes = await deleteFromCloudinary(publicId);
            console.log({ deletedImageRes });
          }
        }

        // Upload the new image
        const { createReadStream } = await file;
        const stream = createReadStream();
        const newImageUrl = await uploadToCloudinary(stream);

        // Update product with new image URL
        product.imageUrl = newImageUrl;
        await product.save();

        return product;
      } catch (error) {
        throw new Error("Failed to update product image");
      }
    },
  },
};

export default productResolvers;
