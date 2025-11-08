import nodemailer from 'nodemailer';
import config from '../../../config';

const emailSender = async (email: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: config.emailSender.email, 
        pass: config.emailSender.app_pass, 
      },
      tls: {
        rejectUnauthorized: false, 
      },
      connectionTimeout: 10000, 
      socketTimeout: 15000,
    });

    const info = await transporter.sendMail({
      from: `"PH Health Care" <${config.emailSender.email}>`,
      to: email,
      subject: "Reset Password Link",
      html,
    });

    console.log(" Email sent:", info.messageId);
  } catch (error: any) {
    console.error(" Email sending failed:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};

export default emailSender;
