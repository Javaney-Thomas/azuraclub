"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { UPDATE_PRODUCT_IMAGE } from "@/app/shared/utils/queries";
import { Edit3 } from "lucide-react";

interface ImageUploadProps {
  currentImage: string;
  productId: string;
  onImageUpload: (newImage: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  productId,
  onImageUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateProductImage, { loading }] = useMutation(UPDATE_PRODUCT_IMAGE, {
    onCompleted: (data) => {
      toast.success("Image updated successfully!");
      onImageUpload(data.updateProductImage.imageUrl);
      setSelectedFile(null);
    },
    onError: (error) => {
      console.log(error, "me");
      toast.error(error.message || "Failed to update image");
    },
  });

  // Trigger file selector
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Update preview and selected file on change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  // Revert to original image
  const handleRemoveSelection = () => {
    setSelectedFile(null);
    setPreview(currentImage);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Send new image to the backend
  const handleUpdateImage = async () => {
    if (!selectedFile) return;
    console.log(selectedFile, "fileInputRef");
    console.log(productId, "productId");
    try {
      const res = await updateProductImage({
        variables: { id: productId, file: selectedFile },
      });

      console.log({ res });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-64 h-64 cursor-pointer"
        onClick={handleImageClick}
      >
        <Image
          src={preview}
          alt="Product Image"
          fill
          className="object-cover rounded-lg"
        />
        {/* Small circular overlay for the edit icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 p-2 rounded-full">
            <Edit3 className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {selectedFile && (
        <div className="mt-4 flex gap-4">
          <Button onClick={handleUpdateImage} disabled={loading}>
            {loading ? "Updating..." : "Update Image"}
          </Button>
          <Button variant="destructive" onClick={handleRemoveSelection}>
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
