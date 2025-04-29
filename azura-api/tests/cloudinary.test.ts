import { Writable, Readable } from "stream";
import cloudinary, { uploadToCloudinary } from "../src/config/cloudinary";

describe("Cloudinary Integration", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should successfully upload a file and return the secure URL", async () => {
    // Create a dummy readable stream to simulate file input.
    const dummyStream = new Readable();
    dummyStream.push("dummy file content");
    dummyStream.push(null); // End of stream

    // Define the URL we expect to get back.
    const expectedSecureUrl =
      "https://res.cloudinary.com/demo/image/upload/v123456/dummy.jpg";

    // Spy on cloudinary.uploader.upload_stream and simulate a successful upload.
    const uploadStreamSpy = jest
      .spyOn(cloudinary.uploader, "upload_stream")
      // Explicitly cast the mock implementation to `any` to avoid type errors
      .mockImplementation(((_options: any, callback: any) => {
        process.nextTick(() => {
          callback(null, { secure_url: expectedSecureUrl });
        });
        // Return a dummy object with a `pipe` method
        return { pipe: jest.fn() };
      }) as any);

    // Call the upload function.
    const result = await uploadToCloudinary(dummyStream);
    expect(result).toBe(expectedSecureUrl);
    expect(uploadStreamSpy).toHaveBeenCalled();
  });

  it("should reject with an error when Cloudinary upload fails", async () => {
    const dummyStream = new Readable();
    dummyStream.push("dummy file content");
    dummyStream.push(null);

    const errorMessage = "Network error during upload";

    // Spy and simulate an error from Cloudinary.
    const uploadStreamSpy = jest
      .spyOn(cloudinary.uploader, "upload_stream")
      // Explicitly cast the mock implementation to `any`
      .mockImplementation(((_options: any, callback: any) => {
        process.nextTick(() => {
          callback(new Error(errorMessage), null);
        });
        return { pipe: jest.fn() };
      }) as any);

    await expect(uploadToCloudinary(dummyStream)).rejects.toThrow(errorMessage);
    expect(uploadStreamSpy).toHaveBeenCalled();
  });

  it("should reject when Cloudinary returns a result without a secure_url", async () => {
    const dummyStream = new Readable();
    dummyStream.push("dummy file content");
    dummyStream.push(null);

    // Spy and simulate a scenario where result is returned without a secure_url.
    const uploadStreamSpy = jest
      .spyOn(cloudinary.uploader, "upload_stream")
      // Explicitly cast the mock implementation to `any`
      .mockImplementation(((_options: any, callback: any) => {
        process.nextTick(() => {
          callback(null, {}); // Missing secure_url property
        });
        return { pipe: jest.fn() };
      }) as any);

    await expect(uploadToCloudinary(dummyStream)).rejects.toEqual(
      "Upload failed"
    );
    expect(uploadStreamSpy).toHaveBeenCalled();
  });
});
