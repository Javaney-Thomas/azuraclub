export type ProductType = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
};
export type CartProduct = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
};

export type CartItem = {
  id: string;
  quantity: number;
  product: CartProduct;
};
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};
export type OrderItemType = {
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
  price: number;
};

export type OrderType = {
  id: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  items: OrderItemType[];
  total: number;
  status: string;
  createdAt: string;
};
export type ReviewType = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
