"use client";
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImgComp } from "@/app/shared/ImgComp";
import { ProductType } from "../../type";
import { Modal } from "@/app/shared/modal";
import Auth from "@/app/(landingPage)/(auth)";
import Link from "next/link";
import { useAddProductToCart } from "@/app/shared/hooks/useAddProductToCart";

const ProductCard = ({ product }: { product: ProductType }) => {
  const { addProductToCart, loading } = useAddProductToCart();
  const [openLogin, setOpenLogin] = useState(false);

  const handleAddToCart = async () => {
    await addProductToCart(product.id, 1, () => setOpenLogin(true));
  };

  if (openLogin) {
    return (
      <Modal open={openLogin} onOpenChange={setOpenLogin}>
        <Auth setCloseModal={setOpenLogin} />
      </Modal>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 flex flex-col shadow-md">
      {/* Product Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative flex-grow flex items-center justify-center p-4 mb-4"
      >
        <ImgComp
          src={product.imageUrl}
          alt={product.title}
          width={180}
          height={180}
          className="object-contain h-32"
        />
      </Link>

      {/* Product Info */}
      <div className="mt-auto">
        <h3 className="text-base font-medium text-gray-900 truncate">
          {product.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{product.description}</p>

        {/* Price Section */}
        <div className="flex flex-col mb-3">
          <span className="text-base text-emerald-600 font-medium">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full cursor-pointer bg-primaryx hover:bg-primaryx-hover text-white rounded-full py-2 px-4 flex items-center justify-center text-sm gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Cart</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
