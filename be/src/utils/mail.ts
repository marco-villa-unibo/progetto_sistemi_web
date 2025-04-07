import nodemailer, { SentMessageInfo } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const SG_API_KEY = process.env.SENDGRID_API_KEY as string;

// NOTE: mail provider settings
// const transporter = nodemailer.createTransport(
//   snt({
//     auth: {
//       api_key: SG_API_KEY,
//     },
//   })
// );

const transporter = nodemailer.createTransport();

// Fattorizzata per poter usare in tutta l'applicazione (es. Sign-In)
export const mailingService = (
  to: string,
  subject: string,
  htmlBody: string
): Promise<SentMessageInfo> => {
  return transporter.sendMail({
    to: to,
    from: 'shop@sistemi.web',
    subject: subject,
    html: htmlBody,
  });
};
