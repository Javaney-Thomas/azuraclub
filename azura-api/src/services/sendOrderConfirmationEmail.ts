// src/services/sendOrderConfirmationEmail.ts

interface User {
  email: string;
  name?: string;
}

interface Order {
  _id: string;
  items: any[];
  createdAt: Date;
}

export const sendOrderConfirmationEmail = async (user: User, order: Order) => {
  console.log(`[MOCK] Sending confirmation email to ${user.email} for order ${order._id}`);
  // Simulate async delay
  return new Promise((resolve) => setTimeout(resolve, 500));
};
