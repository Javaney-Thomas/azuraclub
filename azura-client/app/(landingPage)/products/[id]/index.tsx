"use client";
import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { GET_PRODUCT } from "@/app/shared/utils/queries";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCategory from "./components/ProductCategoryCarousel";
import { Modal } from "@/app/shared/modal";
import Auth from "../../(auth)";
import { useState } from "react";
import { useAddProductToCart } from "@/app/shared/hooks/useAddProductToCart";
import ProductReviews from "./components/ProductReviews";

export default function ProductDetails() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_PRODUCT, { variables: { id } });
  const { addProductToCart, loading: isAddToCartPending } =
    useAddProductToCart();
  const [openLogin, setOpenLogin] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Skeleton className="w-80 h-80 rounded-xl" />
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-64 h-4" />
        <Skeleton className="w-36 h-4" />
      </div>
    );
  }

  if (error || !data?.product)
    return (
      <p className="text-center text-red-500 text-lg">Failed to load product</p>
    );

  const {
    id: productId,
    title,
    description,
    price,
    imageUrl,
    category,
  } = data.product;

  const handleAddToCart = async () => {
    await addProductToCart(productId, 1, () => setOpenLogin(true));
  };

  if (openLogin) {
    return (
      <Modal open={openLogin} onOpenChange={setOpenLogin}>
        <Auth setCloseModal={setOpenLogin} />
      </Modal>
    );
  }
  return (
    <section className="container mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="flex justify-center">
          <div className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
            <Image
              src={imageUrl || "/images/placeholder.png"}
              alt={title}
              layout="fill"
              objectFit="contain"
              className="rounded-2xl "
            />
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900">{title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
          <p className="text-3xl font-semibold text-primary">${price}</p>
          <Button
            onClick={handleAddToCart}
            disabled={isAddToCartPending}
            className="w-full md:w-auto px-6 py-3 text-lg bg-primaryx hover:bg-primaryx/80 text-white rounded-lg transition"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <ProductReviews productId={productId} />
      <div className="mt-16">
        <ProductCategory category={category} />
      </div>
    </section>
  );
}
