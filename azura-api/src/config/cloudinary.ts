import { v2 as cloudinary } from "cloudinary";
import env from "./env";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

// Function to upload a file stream to Cloudinary
export const uploadToCloudinary = (
  stream: NodeJS.ReadableStream
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const streamLoad = cloudinary.uploader.upload_stream(
      { folder: "azura-products" }, // Upload to the "products" folder
      (error, result) => {
        if (error) {
          // Suppress logging in test environment to avoid "log after tests are done"
          if (process.env.NODE_ENV !== "test") {
            console.error("Error during Cloudinary upload:", error);
          }
          return reject(error);
        }
        if (result && result.secure_url) {
          if (process.env.NODE_ENV !== "test") {
            console.log(
              "Successfully uploaded to Cloudinary:",
              result.secure_url
            );
          }
          resolve(result.secure_url);
        } else {
          reject("Cloudinary upload failed");
        }
      }
    );

    // Pipe the file stream into Cloudinary's upload stream
    stream.pipe(streamLoad);
  });
};
export const deleteFromCloudinary = async (publicId: string) => {
  await cloudinary.uploader.destroy(`azura-products/${publicId}`);
};

export default cloudinary;
