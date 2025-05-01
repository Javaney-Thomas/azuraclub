interface CartItem {
  productId: string;
  quantity: number;
}

export const createOrderAndClearCart = async (userId: string, cartItems: CartItem[]) => {
  console.log(`[MOCK] Creating order for user: ${userId}`);
  console.log(`[MOCK] Clearing cart items:`, cartItems);

  // ✅ Return a mock order object with _id as a plain string
  return {
    _id: "mock_order_id_12345",
    items: cartItems,
    userId,
    createdAt: new Date(),
  };
};

