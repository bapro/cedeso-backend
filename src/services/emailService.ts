// src/services/emailService.ts
import nodemailer from "nodemailer";

export const sendVerificationCode = async (
  email: string,
  code: string
): Promise<boolean> => {
  try {
    console.log("📧 Attempting to send email to:", email);

    const transporter = nodemailer.createTransport({
      host: "mail.gicrerd.com", // Remove 'ssl://' prefix
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: "servicio@gicrerd.com",
        pass: "R_0!Wn6X^1YK",
      },
      tls: {
        // You might need to add this for some servers
        rejectUnauthorized: false,
      },
    });

    console.log("✅ Transporter created, sending mail...");

    const mailOptions = {
      from: '"CEDESO App" <servicio@gicrerd.com>',
      to: email,
      subject: "Your Verification Code - CEDESO",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification - CEDESO</h2>
          <p>Please use the following verification code to complete your registration:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; color: #007AFF; letter-spacing: 5px; font-size: 32px;">${code}</h1>
          </div>
          <p><strong>This code will expire in 10 minutes.</strong></p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">CEDESO - Centro de Desarrollo Sostenible</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};
