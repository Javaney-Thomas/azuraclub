// emailHelper.ts
import { OrdetyperType } from "../type";
import { sendEmail } from "./mailer.util";

export async function sendReviewRequestEmail(
  user: {
    email: string;
    name?: string;
  },
  order: OrdetyperType
): Promise<void> {
  console.log({ user, order }, "from order email sender");
  const subject = "We'd Love Your Feedback on Your Recent Order!";
  const reviewLinkBase = `${process.env.FRONTEND_URL}/review?productId=`;
  const userEmail = user.email;
  // Build HTML for each order item
  const itemsHtml = order.items
    .map((item) => {
      return `
      <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #ddd;">
        <a href="${reviewLinkBase}${item.product.id}" style="color: #1a73e8; font-size: 16px; text-decoration: none;">
          ${item.product.title}
        </a>
        <div style="margin-top: 8px;">
          <img src="${item.product.imageUrl}" alt="${item.product.title}" style="width: 100px; height: auto; border-radius: 4px;" />
        </div>
      </div>
    `;
    })
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hello ${user.name} Thank you for your recent purchase. Your order has been delivered, and we would love to hear your thoughts!</p>
      <p>Please review the following products:</p>
      ${itemsHtml}
      <p>We appreciate your feedback!</p>
    </div>
  `;

  await sendEmail(userEmail, subject, html);
}
