import { AnyAaaaRecord } from "node:dns";

type OrderItemType = {
  product: {
    _id?: string;
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
  price: number;
};

export type OrdetyperType = {
  id: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
  items: OrderItemType[];
  total: number;
  status: string;
  createdAt: string;
};

export const transformOrderToOrderType = (orderDoc: any) => {
  const orderObj = orderDoc.toObject();
  return {
    id: orderObj._id.toString(),
    user: {
      id: orderObj.user._id ? orderObj.user._id.toString() : orderObj.user.id,
      email: orderObj.user.email,
      name: orderObj.user.name || "",
    },
    items: orderObj.items.map((item: OrderItemType) => ({
      product: {
        id: item.product._id ? item.product._id.toString() : item.product.id,
        title: item.product.title,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
      },
      quantity: item.quantity,
      price: item.price,
    })),
    total: orderObj.total,
    status: orderObj.status,
    createdAt: orderObj.createdAt,
  };
};
