import { ImgComp } from "@/app/shared/ImgComp";
import Link from "next/link";

export const categories = [
  {
    name: "Gaming Accessories",
    image: "/images/category/gaming-accessories.jpg",
    slug: "gaming_accessories",
  },
  {
    name: "Electronics",
    image: "/images/category/electronics.jpg",
    slug: "electronics",
  },
  {
    name: "Home Office",
    image: "/images/category/homeoffice.jpeg",
    slug: "home_office",
  },
  {
    name: "Kitchen Appliances",
    image: "/images/category/kitchen.png",
    slug: "kitchen_appliances",
  },
  { name: "Fashion", image: "/images/category/fashion.webp", slug: "fashion" },
  { name: "Books", image: "/images/category/books.jpeg", slug: "books" },
  {
    name: "Health & Beauty",
    image: "/images/category/health-and-beauty.jpg",
    slug: "health_beauty",
  },
  {
    name: "Toys & Games",
    image: "/images/category/toys.webp",
    slug: "toys_games",
  },
];

const ProductsCategories = () => {
  return (
    <section className="py-12 w-full">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10">
        {categories.map((category) => (
          <Link
            href={`/products?category=${category.slug}`}
            key={category.slug}
            className="group relative cursor-pointer overflow-hidden rounded-xl shadow-md h-[300px]"
          >
            <ImgComp
              src={category.image}
              alt={category.name}
              width={300}
              height={200}
              className="rounded-xl object-cover w-full h-[300px] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 rounded-xl">
              <span className="text-white text-lg font-semibold">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductsCategories;
