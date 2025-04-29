import nodemailer from "nodemailer";
import env from "../config/env";

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: Number(env.smtp.port) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });

  await transporter.sendMail({
    from: `"Azura Support" <${env.smtp.user}>`,
    to,
    subject,
    html,
  });
};
